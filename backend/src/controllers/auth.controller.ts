import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess, sendCreated, sendError } from '../utils/apiResponse';
import { withDbRetry } from '../config/database';
import UserProfile from '../models/UserProfile.model';
import {
  registerSchema,
  loginSchema,
  adminRegisterSchema,
  adminLoginSchema,
  changePasswordSchema,
} from '../validators/user.validator';
import { signJwt, verifyJwt } from '../utils/jwt';
import { config } from '../config/env';
import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';
import { recordAction, AuditActions } from '../services/auditLog.service';
import { sendWelcomeEmail } from '../services/email.service';
import { generateMemberId, generateAdminId } from '../services/idGenerator.service';

function maskPhone(phone?: string): string {
  if (!phone) return '';
  const clean = phone.trim();
  if (clean.length <= 4) return '****';
  return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
}

function parseUserAgent(ua?: string): { device: string; browser: string; os: string } {
  if (!ua) return { device: 'Unknown Device', browser: 'Web Browser', os: 'Unknown OS' };
  let browser = 'Web Browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  let device = 'Desktop Device';
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) device = 'Mobile Device';
  else if (ua.includes('iPad') || ua.includes('Tablet')) device = 'Tablet Device';

  return { device, browser, os };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim() || req.ip || '127.0.0.1';
  }
  return req.ip || '127.0.0.1';
}

// ─── POST /api/v1/auth/register (Member Registration) ───────────────────────
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const normalizedEmail = data.email.toLowerCase().trim();
  const normalizedPhone = data.phone?.trim() || '';

  // 1. Check if email already exists
  const existingByEmail = await withDbRetry(() => UserProfile.findOne({ email: normalizedEmail }));
  if (existingByEmail) {
    sendError(res, 409, 'CONFLICT', 'An account with this email address already exists. Please sign in.');
    return;
  }

  // 2. Check if phone number already exists on another account
  if (normalizedPhone) {
    const existingByPhone = await withDbRetry(() => UserProfile.findOne({ phone: normalizedPhone }));
    if (existingByPhone) {
      sendError(res, 409, 'CONFLICT', 'An account with this phone number already exists.');
      return;
    }
  }

  // 3. Create Supabase Auth account with auto-confirm enabled (server-side only)
  let supabaseUserId: string | undefined;
  if (supabaseAdmin) {
    try {
      const { data: suData, error: suError } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName.trim(),
          phone: normalizedPhone,
          role: 'MEMBER',
        },
      });
      if (!suError && suData?.user) {
        supabaseUserId = suData.user.id;
      } else if (suError) {
        logger.warn('Supabase auth account creation notice:', { error: suError.message });
      }
    } catch (suErr: any) {
      logger.warn('Supabase admin API call error during registration:', { error: suErr?.message });
    }
  }

  // 4. Hash password with bcrypt (10 rounds) - never stored plaintext
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  // 5. Generate unique sequential Member ID (e.g. HSYC-KP5-XXXXXX)
  const memberId = await withDbRetry(() => generateMemberId());

  // 6. Create active user account with server-assigned MEMBER role (Client cannot choose role)
  const user = await withDbRetry(() =>
    UserProfile.create({
      supabaseUserId,
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      memberId,
      role: 'MEMBER', // Strictly assigned server-side
      status: 'active',
      isEmailVerified: true,
      isPhoneVerified: true,
    })
  );

  // 7. Fire transactional welcome email (non-blocking)
  sendWelcomeEmail(normalizedEmail, user.fullName).catch(() => {});

  // 8. Session tracking and JWT token issuance (enabling immediate authenticated member session)
  const sessionId = crypto.randomUUID();
  const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
  const ip = getClientIp(req);

  user.lastSignInAt = new Date();
  if (!user.activeSessions) user.activeSessions = [];
  user.activeSessions.push({
    sessionId,
    device,
    browser,
    os,
    ip,
    lastActive: new Date(),
    createdAt: new Date(),
  });
  await user.save();

  const token = signJwt({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    sessionId,
  });

  // 9. Record audit log
  await recordAction({
    userId: user._id,
    action: AuditActions.MEMBER_REGISTERED,
    resource: 'UserProfile',
    resourceId: user._id.toString(),
    metadata: {
      email: user.email,
      phone: maskPhone(user.phone),
      memberId: user.memberId,
      role: user.role,
      sessionId,
    },
    req,
  });

  sendCreated(
    res,
    {
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        memberId: user.memberId,
        role: user.role,
        status: user.status,
      },
      token,
      memberId: user.memberId,
    },
    'Member registration completed successfully.'
  );
});

// ─── POST /api/v1/auth/login (Member Login) ────────────────────────────────
export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const identifier = (data.emailOrId || data.email || '').trim();

  // Find user by Email or Member ID or Admin ID
  const user = await UserProfile.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { memberId: identifier.toUpperCase() },
      { adminId: identifier.toUpperCase() },
    ],
  }).select('+passwordHash');

  if (!user || !user.passwordHash) {
    await recordAction({
      userId: user?._id || new mongoose.Types.ObjectId(),
      action: AuditActions.MEMBER_LOGIN_FAILED,
      resource: 'Auth',
      metadata: { identifier, reason: 'user_not_found' },
      req,
    });
    sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email / Member ID or password');
    return;
  }

  // Verify password with bcrypt
  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    await recordAction({
      userId: user._id,
      action: AuditActions.MEMBER_LOGIN_FAILED,
      resource: 'Auth',
      metadata: { email: user.email, memberId: user.memberId, reason: 'bad_password' },
      req,
    });
    sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email / Member ID or password');
    return;
  }

  // Check account status
  if (user.status === 'suspended') {
    sendError(res, 403, 'ACCOUNT_SUSPENDED', 'Your account has been suspended. Please contact administration.');
    return;
  }
  if (user.status === 'inactive') {
    sendError(res, 403, 'ACCOUNT_INACTIVE', 'Your account is inactive. Please contact administration.');
    return;
  }

  // Session tracking
  const sessionId = crypto.randomUUID();
  const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
  const ip = getClientIp(req);

  user.lastSignInAt = new Date();
  if (!user.activeSessions) user.activeSessions = [];
  user.activeSessions.push({
    sessionId,
    device,
    browser,
    os,
    ip,
    lastActive: new Date(),
    createdAt: new Date(),
  });
  if (user.activeSessions.length > 10) {
    user.activeSessions = user.activeSessions.slice(-10);
  }
  await user.save();

  // Generate real JWT token with sessionId
  const token = signJwt({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    sessionId,
  });

  await recordAction({
    userId: user._id,
    action: AuditActions.MEMBER_LOGIN,
    resource: 'Auth',
    metadata: { role: user.role, email: user.email, memberId: user.memberId, sessionId, device, browser },
    req,
  });

  sendSuccess(
    res,
    {
      user: {
        _id: user._id,
        memberId: user.memberId,
        adminId: user.adminId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        address: user.address,
        interests: user.interests,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
    'Login successful'
  );
});

// ─── POST /api/v1/auth/admin/register (Authorized Admin Provisioning) ───────
export const adminRegister = asyncHandler(async (req: Request, res: Response) => {
  const data = adminRegisterSchema.parse(req.body);
  const normalizedEmail = data.email.toLowerCase().trim();
  const normalizedPhone = data.phone?.trim() || '';

  // Duplicate email check
  const existingUser = await UserProfile.findOne({ email: normalizedEmail });
  if (existingUser) {
    sendError(res, 409, 'CONFLICT', 'An account with this email address already exists.');
    return;
  }

  // Duplicate phone check
  if (normalizedPhone) {
    const existingPhone = await UserProfile.findOne({ phone: normalizedPhone });
    if (existingPhone) {
      sendError(res, 409, 'CONFLICT', 'An account with this phone number already exists.');
      return;
    }
  }

  // Security: Role is determined strictly by the server
  const isSuperAdminEmail =
    config.SUPER_ADMIN_EMAIL && normalizedEmail === config.SUPER_ADMIN_EMAIL.toLowerCase();
  const role = isSuperAdminEmail ? 'SUPER_ADMIN' : 'ADMIN';

  // Automatically generate unique sequential Admin ID (e.g. HSYC-ADM-XXXXXX)
  const adminId = await generateAdminId();

  // Create Supabase Auth account with auto-confirm enabled
  let supabaseUserId: string | undefined;
  if (supabaseAdmin) {
    try {
      const { data: suData, error: suError } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName.trim(),
          phone: normalizedPhone,
          role,
        },
      });
      if (!suError && suData?.user) {
        supabaseUserId = suData.user.id;
      }
    } catch (suErr: any) {
      logger.warn('Supabase admin API call error during admin registration:', { error: suErr?.message });
    }
  }

  // Hash password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const user = await UserProfile.create({
    supabaseUserId,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    adminId,
    memberId: adminId,
    role,
    status: 'active',
    isEmailVerified: true,
    isPhoneVerified: true,
  });

  await recordAction({
    userId: user._id,
    action: AuditActions.ADMIN_CREATED,
    resource: 'UserProfile',
    resourceId: user._id.toString(),
    metadata: { role: user.role, email: user.email, adminId: user.adminId },
    req,
  });

  sendCreated(
    res,
    {
      email: user.email,
      phone: user.phone,
      adminId: user.adminId,
      role: user.role,
    },
    'Administrator account provisioned successfully. You can now sign in.'
  );
});

// ─── POST /api/v1/auth/admin/login ─────────────────────────────────────────
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const data = adminLoginSchema.parse(req.body);
  const identifier = (data.emailOrId || data.email || '').trim();

  const user = await UserProfile.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { adminId: identifier.toUpperCase() },
      { memberId: identifier.toUpperCase() },
    ],
  }).select('+passwordHash');

  if (!user || !user.passwordHash) {
    await recordAction({
      userId: user?._id || new mongoose.Types.ObjectId(),
      action: AuditActions.ADMIN_LOGIN_FAILED,
      resource: 'Auth',
      metadata: { identifier, reason: 'user_not_found', adminLogin: true },
      req,
    });
    sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid administrator credentials');
    return;
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    await recordAction({
      userId: user._id,
      action: AuditActions.ADMIN_LOGIN_FAILED,
      resource: 'Auth',
      metadata: { email: user.email, adminId: user.adminId, reason: 'bad_password', adminLogin: true },
      req,
    });
    sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid administrator credentials');
    return;
  }

  // Security: Check administrator role
  const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER'];
  if (!adminRoles.includes(user.role)) {
    sendError(res, 403, 'ADMIN_ACCESS_REQUIRED', 'Access denied. Account lacks administrator privileges.');
    return;
  }

  if (user.status === 'suspended') {
    sendError(res, 403, 'ACCOUNT_SUSPENDED', 'Administrator account suspended. Contact root administration.');
    return;
  }
  if (user.status === 'inactive') {
    sendError(res, 403, 'ACCOUNT_INACTIVE', 'Administrator account is inactive. Contact root administration.');
    return;
  }

  const sessionId = crypto.randomUUID();
  const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
  const ip = getClientIp(req);

  user.lastSignInAt = new Date();
  if (!user.activeSessions) user.activeSessions = [];
  user.activeSessions.push({
    sessionId,
    device,
    browser,
    os,
    ip,
    lastActive: new Date(),
    createdAt: new Date(),
  });
  if (user.activeSessions.length > 10) {
    user.activeSessions = user.activeSessions.slice(-10);
  }
  await user.save();

  const token = signJwt({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    sessionId,
  });

  await recordAction({
    userId: user._id,
    action: AuditActions.ADMIN_LOGIN,
    resource: 'Auth',
    metadata: { role: user.role, email: user.email, adminId: user.adminId, sessionId, device, browser },
    req,
  });

  sendSuccess(
    res,
    {
      user: {
        _id: user._id,
        adminId: user.adminId,
        memberId: user.memberId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    },
    'Administrator signed in successfully'
  );
});

// ─── POST /api/v1/auth/logout ──────────────────────────────────────────────
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      const jwtPayload = verifyJwt(token);
      if (jwtPayload && jwtPayload.id && jwtPayload.sessionId) {
        await UserProfile.updateOne(
          { _id: jwtPayload.id },
          { $pull: { activeSessions: { sessionId: jwtPayload.sessionId } } }
        ).catch(() => {});
      }
    }
  }

  if (req.user) {
    const isMember = req.user.profile.role === 'MEMBER';
    await recordAction({
      userId: req.user.profile._id,
      action: isMember ? AuditActions.MEMBER_LOGOUT : AuditActions.ADMIN_LOGOUT,
      resource: 'Auth',
      metadata: { role: req.user.profile.role, sessionId: req.sessionId },
      req,
    });
  }

  sendSuccess(res, null, 'Logged out successfully');
});

// ─── GET /api/v1/auth/me ───────────────────────────────────────────────────
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, req.user!.profile);
});

// ─── POST /api/v1/auth/change-password ─────────────────────────────────────
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const data = changePasswordSchema.parse(req.body);
  const userId = req.user!.profile._id;

  const user = await UserProfile.findById(userId).select('+passwordHash');
  if (!user || !user.passwordHash) {
    sendError(res, 404, 'USER_NOT_FOUND', 'User profile not found');
    return;
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isMatch) {
    sendError(res, 400, 'INVALID_CURRENT_PASSWORD', 'The current password you entered is incorrect.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(data.newPassword, salt);
  user.activeSessions = user.activeSessions?.filter((s) => s.sessionId === req.sessionId) || [];
  await user.save();

  await recordAction({
    userId: user._id,
    action: AuditActions.PASSWORD_CHANGED,
    resource: 'UserProfile',
    resourceId: user._id.toString(),
    metadata: { email: user.email },
    req,
  });

  sendSuccess(res, null, 'Password successfully updated.');
});

// ─── GET /api/v1/auth/security-info ─────────────────────────────────────────
export const getSecurityInfo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.profile._id;
  const user = await UserProfile.findById(userId);
  if (!user) {
    sendError(res, 404, 'USER_NOT_FOUND', 'User profile not found');
    return;
  }

  const currentSessionId = req.sessionId;
  const rawSessions =
    user.activeSessions && user.activeSessions.length > 0
      ? user.activeSessions
      : [
          {
            sessionId: currentSessionId || crypto.randomUUID(),
            device: parseUserAgent(req.headers['user-agent']).device,
            browser: parseUserAgent(req.headers['user-agent']).browser,
            os: parseUserAgent(req.headers['user-agent']).os,
            ip: getClientIp(req),
            lastActive: user.lastSignInAt || new Date(),
            createdAt: user.lastSignInAt || new Date(),
          },
        ];

  const activeSessions = rawSessions
    .map((s) => ({
      sessionId: s.sessionId,
      device: s.device || 'Desktop Device',
      browser: s.browser || 'Web Browser',
      os: s.os || 'Unknown OS',
      ip: s.ip || '127.0.0.1',
      lastActive: s.lastActive || s.createdAt,
      createdAt: s.createdAt,
      isCurrent: currentSessionId ? s.sessionId === currentSessionId : true,
    }))
    .reverse();

  sendSuccess(
    res,
    {
      accountId: user.memberId || user.adminId || user._id.toString(),
      email: user.email,
      phone: user.phone,
      isEmailVerified: !!user.isEmailVerified,
      isPhoneVerified: !!user.isPhoneVerified,
      authProvider: user.authProvider || 'Email / Password',
      lastSignInAt: user.lastSignInAt || user.updatedAt,
      activeSessions,
      currentSessionId,
    },
    'Security info loaded'
  );
});

// ─── POST /api/v1/auth/sessions/revoke-others ─────────────────────────────
export const revokeOtherSessions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.profile._id;
  const currentSessionId = req.sessionId;

  const user = await UserProfile.findById(userId);
  if (!user) {
    sendError(res, 404, 'USER_NOT_FOUND', 'User profile not found');
    return;
  }

  const initialCount = user.activeSessions?.length || 0;
  user.activeSessions = user.activeSessions?.filter((s) => s.sessionId === currentSessionId) || [];
  await user.save();

  await recordAction({
    userId: user._id,
    action: AuditActions.SESSIONS_REVOKED,
    resource: 'UserProfile',
    resourceId: user._id.toString(),
    metadata: { keptSessionId: currentSessionId, revokedCount: Math.max(0, initialCount - (currentSessionId ? 1 : 0)) },
    req,
  });

  sendSuccess(res, { remainingSessions: user.activeSessions?.length || 1 }, 'All other active sessions have been signed out.');
});
