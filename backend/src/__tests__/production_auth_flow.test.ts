import bcrypt from 'bcryptjs';
import { signJwt, verifyJwt } from '../utils/jwt';
import {
  registerSchema,
  loginSchema,
  adminRegisterSchema,
  adminLoginSchema,
  changePasswordSchema,
} from '../validators/user.validator';
import { AuditActions } from '../services/auditLog.service';

describe('Production Authentication System Comprehensive Tests', () => {
  describe('1. Member Registration Validation & Security', () => {
    it('should validate valid member registration payload', () => {
      const valid = registerSchema.safeParse({
        fullName: 'Aarav Sharma',
        email: 'aarav@example.com',
        phone: '+977 9841234567',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
      });
      expect(valid.success).toBe(true);
    });

    it('should reject registration when confirmPassword does not match', () => {
      const mismatch = registerSchema.safeParse({
        fullName: 'Aarav Sharma',
        email: 'aarav@example.com',
        phone: '+977 9841234567',
        password: 'Password@2026',
        confirmPassword: 'DifferentPassword@2026',
      });
      expect(mismatch.success).toBe(false);
      if (!mismatch.success) {
        expect(mismatch.error.errors[0]?.message).toBe('Passwords do not match');
      }
    });

    it('should reject invalid email format', () => {
      const invalidEmail = registerSchema.safeParse({
        fullName: 'Aarav Sharma',
        email: 'not-an-email',
        phone: '+977 9841234567',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
      });
      expect(invalidEmail.success).toBe(false);
    });

    it('should reject passwords shorter than 6 characters', () => {
      const weak = registerSchema.safeParse({
        fullName: 'Aarav Sharma',
        email: 'aarav@example.com',
        phone: '+977 9841234567',
        password: '123',
        confirmPassword: '123',
      });
      expect(weak.success).toBe(false);
    });

    it('should reject client-provided role tampering in member registration', () => {
      const tampered = registerSchema.parse({
        fullName: 'Malicious Member',
        email: 'malicious@example.com',
        phone: '+977 9841234567',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
        role: 'SUPER_ADMIN',
      });
      expect((tampered as any).role).toBeUndefined();
    });
  });

  describe('2. Direct Login with Email or Member ID', () => {
    it('should accept login with Email', () => {
      const parsed = loginSchema.safeParse({
        emailOrId: 'member@example.com',
        password: 'Password@2026',
      });
      expect(parsed.success).toBe(true);
    });

    it('should accept login with unique Member ID', () => {
      const parsed = loginSchema.safeParse({
        emailOrId: 'HSYC-KP5-9D8CB1',
        password: 'Password@2026',
      });
      expect(parsed.success).toBe(true);
    });

    it('should accept login with Admin ID', () => {
      const parsed = adminLoginSchema.safeParse({
        emailOrId: 'HSYC-ADM-4F82B7',
        password: 'AdminPassword@2026',
      });
      expect(parsed.success).toBe(true);
    });
  });

  describe('3. JWT Token Generation & Verification', () => {
    it('should issue and verify standard JWT session token', () => {
      const token = signJwt(
        {
          id: '507f1f77bcf86cd799439011',
          email: 'member@example.com',
          role: 'MEMBER',
          sessionId: 'test-session-uuid',
        },
        86400
      );

      const decoded = verifyJwt(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe('507f1f77bcf86cd799439011');
      expect(decoded?.email).toBe('member@example.com');
      expect(decoded?.role).toBe('MEMBER');
      expect(decoded?.sessionId).toBe('test-session-uuid');
    });
  });

  describe('4. Password Change Validation', () => {
    it('should validate authenticated password change schema with strong requirements', () => {
      const valid = changePasswordSchema.safeParse({
        currentPassword: 'CurrentPassword@2026',
        newPassword: 'NewSecurePassword@2026',
        confirmPassword: 'NewSecurePassword@2026',
      });
      expect(valid.success).toBe(true);
    });

    it('should reject password change when new passwords do not match', () => {
      const mismatch = changePasswordSchema.safeParse({
        currentPassword: 'CurrentPassword@2026',
        newPassword: 'NewSecurePassword@2026',
        confirmPassword: 'DifferentPassword@2026',
      });
      expect(mismatch.success).toBe(false);
    });
  });

  describe('5. Admin Authorization & Protection', () => {
    it('should validate admin registration input without requiring obsolete security key', () => {
      const valid = adminRegisterSchema.safeParse({
        fullName: 'Staff Administrator',
        email: 'staff@highschoolyouthclub.org',
        phone: '+977 9801234567',
        password: 'AdminPassword@2026',
        confirmPassword: 'AdminPassword@2026',
      });
      expect(valid.success).toBe(true);
    });

    it('should reject admin registration when passwords do not match', () => {
      const invalid = adminRegisterSchema.safeParse({
        fullName: 'Staff Administrator',
        email: 'staff@highschoolyouthclub.org',
        phone: '+977 9801234567',
        password: 'AdminPassword@2026',
        confirmPassword: 'DifferentPassword@2026',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('6. Audit Log Action Keys Verification', () => {
    it('should verify all required lifecycle audit action constants exist', () => {
      expect(AuditActions.MEMBER_REGISTERED).toBe('member.registered');
      expect(AuditActions.MEMBER_LOGIN).toBe('member.login');
      expect(AuditActions.MEMBER_LOGIN_FAILED).toBe('member.login_failed');
      expect(AuditActions.MEMBER_PASSWORD_CHANGED).toBe('member.password_changed');
      expect(AuditActions.MEMBER_LOGOUT).toBe('member.logout');

      expect(AuditActions.ADMIN_CREATED).toBe('admin.created');
      expect(AuditActions.ADMIN_LOGIN).toBe('admin.login');
      expect(AuditActions.ADMIN_LOGIN_FAILED).toBe('admin.login_failed');
      expect(AuditActions.ADMIN_PASSWORD_CHANGED).toBe('admin.password_changed');
      expect(AuditActions.ADMIN_LOGOUT).toBe('admin.logout');
    });
  });
});
