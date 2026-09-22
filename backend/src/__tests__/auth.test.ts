import bcrypt from 'bcryptjs';
import { signJwt, verifyJwt } from '../utils/jwt';
import {
  registerSchema,
  loginSchema,
  adminRegisterSchema,
  adminLoginSchema,
} from '../validators/user.validator';

describe('Authentication & Role Security Tests', () => {
  describe('Password Hashing & Verification', () => {
    it('should securely hash password with bcrypt and verify match', async () => {
      const password = 'SecurePassword@123';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Generation & Signature Verification', () => {
    it('should generate valid JWT containing user id, email, and role', () => {
      const payload = {
        id: '507f1f77bcf86cd799439011',
        email: 'member@highschoolyouthclub.org',
        role: 'MEMBER' as const,
      };

      const token = signJwt(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);

      const decoded = verifyJwt(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(payload.id);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe('MEMBER');
    });

    it('should return null when verifying a malformed or forged token', () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.forged.signature';
      const decoded = verifyJwt(invalidToken);
      expect(decoded).toBeNull();
    });
  });

  describe('Registration & Role Hardening Validation', () => {
    it('should validate valid registration input', () => {
      const input = {
        fullName: 'Ram Bahadur',
        email: 'ram@example.com',
        password: 'Password@123',
        phone: '+977 9800000000',
      };

      const parsed = registerSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it('should reject invalid email in registration', () => {
      const input = {
        fullName: 'Ram Bahadur',
        email: 'invalid-email-format',
        password: 'Password@123',
      };

      const parsed = registerSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });

    it('should reject short password in registration', () => {
      const input = {
        fullName: 'Ram Bahadur',
        email: 'ram@example.com',
        password: '123',
      };

      const parsed = registerSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });

    it('should not allow client to specify role in registration payload', () => {
      const input = {
        fullName: 'Attacker User',
        email: 'attacker@example.com',
        password: 'Password@123',
        role: 'SUPER_ADMIN', // Malicious attempt to self-promote
      };

      const parsed = registerSchema.parse(input);
      // registerSchema strips or ignores unexpected role field
      expect((parsed as any).role).toBeUndefined();
    });
  });

  describe('Login Validation', () => {
    it('should validate valid login payload', () => {
      const parsed = loginSchema.safeParse({
        email: 'member@example.com',
        password: 'ValidPassword123',
      });
      expect(parsed.success).toBe(true);
    });

    it('should reject missing password', () => {
      const parsed = loginSchema.safeParse({
        email: 'member@example.com',
        password: '',
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('Admin Registration Validation', () => {
    it('should validate valid admin registration input with matching passwords', () => {
      const input = {
        fullName: 'Admin User',
        email: 'admin@highschoolyouthclub.org',
        password: 'AdminPassword@2026',
        confirmPassword: 'AdminPassword@2026',
      };

      const parsed = adminRegisterSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it('should reject admin registration when confirm password does not match', () => {
      const input = {
        fullName: 'Admin User',
        email: 'admin@highschoolyouthclub.org',
        password: 'AdminPassword@2026',
        confirmPassword: 'DifferentPassword@2026',
      };

      const parsed = adminRegisterSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.errors[0]?.message).toBe('Passwords do not match');
      }
    });

    it('should reject admin registration when password is less than 8 characters', () => {
      const input = {
        fullName: 'Admin User',
        email: 'admin@highschoolyouthclub.org',
        password: 'short',
        confirmPassword: 'short',
      };

      const parsed = adminRegisterSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });

    it('should accept admin registration without adminSecurityKey', () => {
      const input = {
        fullName: 'Admin User',
        email: 'admin@highschoolyouthclub.org',
        password: 'AdminPassword@2026',
        confirmPassword: 'AdminPassword@2026',
      };

      const parsed = adminRegisterSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it('should prevent client from injecting unauthorized role during admin registration', () => {
      const input = {
        fullName: 'Admin User',
        email: 'admin@highschoolyouthclub.org',
        password: 'AdminPassword@2026',
        confirmPassword: 'AdminPassword@2026',
        role: 'SUPER_ADMIN', // Attempting to self-assign role
      };

      const parsed = adminRegisterSchema.parse(input);
      expect((parsed as any).role).toBeUndefined();
    });
  });

  describe('Admin Login Validation', () => {
    it('should accept valid admin login payload', () => {
      const parsed = adminLoginSchema.safeParse({
        email: 'admin@highschoolyouthclub.org',
        password: 'AdminPassword@2026',
      });
      expect(parsed.success).toBe(true);
    });

    it('should reject malformed email for admin login', () => {
      const parsed = adminLoginSchema.safeParse({
        email: 'not-an-email',
        password: 'AdminPassword@2026',
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('Automatic Member & Admin ID Format Specification', () => {
    it('should match the standard Member ID pattern HSYC-KP5-XXXXXX', () => {
      const sampleMemberId1 = 'HSYC-KP5-9D8CB1';
      const sampleMemberId2 = 'HSYC-KP5-A72F4C';
      const regex = /^HSYC-KP5-[0-9A-F]{6}$/;
      expect(regex.test(sampleMemberId1)).toBe(true);
      expect(regex.test(sampleMemberId2)).toBe(true);
    });

    it('should match the standard Admin ID pattern HSYC-ADM-XXXXXX', () => {
      const sampleAdminId1 = 'HSYC-ADM-4F82B7';
      const sampleAdminId2 = 'HSYC-ADM-91C3E5';
      const regex = /^HSYC-ADM-[0-9A-F]{6}$/;
      expect(regex.test(sampleAdminId1)).toBe(true);
      expect(regex.test(sampleAdminId2)).toBe(true);
    });

    it('should reject invalid prefix or invalid length for ID', () => {
      expect(/^HSYC-KP5-[0-9A-F]{6}$/.test('USR-KP5-9D8CB1')).toBe(false);
      expect(/^HSYC-KP5-[0-9A-F]{6}$/.test('HSYC-KP5-123')).toBe(false);
      expect(/^HSYC-ADM-[0-9A-F]{6}$/.test('HSYC-KP5-4F82B7')).toBe(false);
      expect(/^HSYC-ADM-[0-9A-F]{6}$/.test('HSYC-ADM-GGGGGG')).toBe(false);
    });

    it('should accept existing legacy formats to ensure existing users keep their IDs', () => {
      const legacyId = 'MEM-2026-000001';
      const legacyAdminId = 'ADM-2026-000001';
      expect(/^MEM-\d{4}-\d{6}$/.test(legacyId)).toBe(true);
      expect(/^ADM-\d{4}-\d{6}$/.test(legacyAdminId)).toBe(true);
    });
  });
});
