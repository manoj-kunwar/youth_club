import { z } from 'zod';

// ─── Common Reusable Schema Pieces ────────────────────────────────────────

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().max(200).optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// ─── Authentication Validators ────────────────────────────────────────────

export const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().max(20).optional().or(z.literal('')),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100),
    confirmPassword: z.string().optional(),
    avatar: z.string().optional().or(z.literal('')),
  })
  .refine((data) => {
    if (data.confirmPassword !== undefined && data.confirmPassword !== '') {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z
  .object({
    email: z.string().optional(),
    emailOrId: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => !!(data.email || data.emailOrId), {
    message: 'Please enter a valid email address or Member ID',
    path: ['email'],
  });

export const adminRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().max(20).optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    adminSecurityKey: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const adminLoginSchema = z
  .object({
    email: z.string().optional(),
    emailOrId: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine(
    (data) => {
      const raw = data.email || data.emailOrId;
      if (!raw) return false;
      if (data.email) {
        return /^\S+@\S+\.\S+$/.test(data.email);
      }
      return true;
    },
    {
      message: 'Please enter a valid email address or Admin ID',
      path: ['email'],
    }
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(100)
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ─── UserProfile Validators ───────────────────────────────────────────────

export const createUserProfileSchema = z.object({
  supabaseUserId: z.string().optional(),
  fullName: z.string().min(1).max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  avatar: z.string().optional().or(z.literal('')),
  bio: z.string().max(1000).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  interests: z.array(z.string()).optional().default([]),
  bloodGroup: z.string().max(10).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  // Note: role and status cannot be assigned by public clients
});

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().or(z.literal('')),
  avatar: z.string().optional().or(z.literal('')),
  bio: z.string().max(1000).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  interests: z.array(z.string()).optional(),
  bloodGroup: z.string().max(10).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
});

export const rsvpEventSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(20).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type RsvpEventInput = z.infer<typeof rsvpEventSchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER', 'VOLUNTEER', 'MEMBER']),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
});

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
