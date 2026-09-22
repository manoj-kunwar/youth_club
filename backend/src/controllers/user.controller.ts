import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse';
import * as entitiesService from '../services/entities.service';
import UserProfile from '../models/UserProfile.model';
import { createUserProfileSchema, updateUserProfileSchema, updateUserRoleSchema } from '../validators/user.validator';
import { paginationSchema } from '../validators/user.validator';
import { recordAction, AuditActions } from '../services/auditLog.service';
import { sendWelcomeEmail } from '../services/email.service';
import { ForbiddenError, NotFoundError } from '../middleware/errorHandler';

// ─── GET /api/v1/users/me ──────────────────────────────────────────────────
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profileWithStats = await entitiesService.getUserProfileWithStats(req.user!.profile._id.toString());
  sendSuccess(res, profileWithStats);
});

// ─── GET /api/v1/users ─────────────────────────────────────────────────────
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const params = paginationSchema.parse({ ...req.query });
  const { role, status } = req.query as { role?: string; status?: string };
  const { data, pagination } = await entitiesService.listUserProfiles({ ...params, role, status });
  sendPaginated(res, data, pagination);
});

// ─── POST /api/v1/users ────────────────────────────────────────────────────
// Called after Supabase signup to create MongoDB profile
export const createUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = createUserProfileSchema.parse(req.body);
  const normalizedEmail = data.email.toLowerCase().trim();

  // Check if profile already exists
  const existing = await UserProfile.findOne({ email: normalizedEmail });
  if (existing) {
    if (!existing.supabaseUserId && data.supabaseUserId) {
      existing.supabaseUserId = data.supabaseUserId;
      await existing.save();
    }
    sendSuccess(res, existing, 'User profile already exists');
    return;
  }

  // Security: explicitly whitelist fields for public profile creation (strictly MEMBER role and active status)
  const safeData = {
    email: normalizedEmail,
    fullName: data.fullName,
    phone: data.phone,
    avatar: data.avatar,
    bio: data.bio,
    address: data.address,
    interests: data.interests,
    bloodGroup: data.bloodGroup,
    dateOfBirth: data.dateOfBirth,
    supabaseUserId: data.supabaseUserId,
    role: 'MEMBER' as const,
    status: 'active' as const,
  };

  const profile = await entitiesService.createUserProfile(safeData as any);

  // Fire welcome email (non-blocking)
  sendWelcomeEmail(profile.email, profile.fullName).catch(() => {/* already logged */});

  await recordAction({
    userId: profile._id,
    action: AuditActions.USER_CREATED,
    resource: 'UserProfile',
    resourceId: profile._id.toString(),
    req,
  });

  sendCreated(res, profile, 'User profile created');
});

// ─── PATCH /api/v1/users/me ───────────────────────────────────────────────
export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const rawData = updateUserProfileSchema.parse(req.body);
  // Security: users cannot tamper with privileged fields. Whitelist only self-editable profile fields.
  const safeData = {
    ...(rawData.fullName !== undefined && { fullName: rawData.fullName }),
    ...(rawData.phone !== undefined && { phone: rawData.phone }),
    ...(rawData.avatar !== undefined && { avatar: rawData.avatar }),
    ...(rawData.bio !== undefined && { bio: rawData.bio }),
    ...(rawData.address !== undefined && { address: rawData.address }),
    ...(rawData.interests !== undefined && { interests: rawData.interests }),
    ...(rawData.bloodGroup !== undefined && { bloodGroup: rawData.bloodGroup }),
    ...(rawData.dateOfBirth !== undefined && { dateOfBirth: rawData.dateOfBirth }),
  };

  const profile = await entitiesService.updateUserProfile(
    req.user!.profile._id.toString(),
    safeData
  );
  sendSuccess(res, profile, 'Profile updated');
});

// ─── PATCH /api/v1/users/:id/role ─────────────────────────────────────────
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const data = updateUserRoleSchema.parse(req.body);
  const targetId = String(req.params['id']);
  const callerRole = req.user!.profile.role;

  // Role security: Only SUPER_ADMIN can assign or modify SUPER_ADMIN role
  if (data.role === 'SUPER_ADMIN' && callerRole !== 'SUPER_ADMIN') {
    throw new ForbiddenError('Only a SUPER_ADMIN can assign the SUPER_ADMIN role');
  }

  const targetUser = await UserProfile.findById(targetId);
  if (!targetUser) {
    throw new NotFoundError('User profile');
  }

  if (targetUser.role === 'SUPER_ADMIN' && data.role !== 'SUPER_ADMIN') {
    if (callerRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only a SUPER_ADMIN can modify a SUPER_ADMIN role');
    }
    const superAdminCount = await UserProfile.countDocuments({ role: 'SUPER_ADMIN', status: 'active' });
    if (superAdminCount <= 1) {
      throw new ForbiddenError('Cannot demote the last remaining active Super Admin');
    }
  }

  const profile = await entitiesService.updateUserRole(targetId, data);

  await recordAction({
    userId: req.user!.profile._id,
    action: AuditActions.USER_ROLE_CHANGED,
    resource: 'UserProfile',
    resourceId: targetId,
    metadata: { newRole: data.role, newStatus: data.status },
    req,
  });

  sendSuccess(res, profile, 'User role updated');
});


// ─── DELETE /api/v1/users/:id ─────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const targetId = String(req.params['id']);

  // Prevent self-deletion
  if (req.user!.profile._id.toString() === targetId) {
    throw new ForbiddenError('You cannot delete your own account');
  }

  // Check target user
  const targetUser = await UserProfile.findById(targetId);
  if (!targetUser) {
    throw new NotFoundError('User profile');
  }

  // Prevent deleting the last or protected Super Admin
  if (targetUser.role === 'SUPER_ADMIN') {
    const superAdminCount = await UserProfile.countDocuments({ role: 'SUPER_ADMIN' });
    if (superAdminCount <= 1) {
      throw new ForbiddenError('Cannot delete the protected or last Super Administrator');
    }
  }

  // Prevent non-SUPER_ADMIN from deleting a SUPER_ADMIN
  if (targetUser.role === 'SUPER_ADMIN' && req.user!.profile.role !== 'SUPER_ADMIN') {
    throw new ForbiddenError('Only a Super Administrator can delete another Super Administrator');
  }

  await entitiesService.deleteUserProfile(targetId);

  await recordAction({
    userId: req.user!.profile._id,
    action: AuditActions.USER_DELETED,
    resource: 'UserProfile',
    resourceId: targetId,
    metadata: {
      deletedUserEmail: targetUser.email,
      deletedUserName: targetUser.fullName,
      deletedUserRole: targetUser.role,
    },
    req,
  });

  sendSuccess(res, null, 'User deleted successfully');
});

