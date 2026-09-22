import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

describe('Frontend Auth Form Validation Tests', () => {
  describe('Login Form Validation', () => {
    it('accepts valid credentials', () => {
      const result = loginSchema.safeParse({
        email: 'member@highschoolyouthclub.org',
        password: 'validPassword123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects malformed email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'validPassword123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password shorter than 6 characters', () => {
      const result = loginSchema.safeParse({
        email: 'member@highschoolyouthclub.org',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Register Form Validation', () => {
    it('accepts valid registration data matching passwords', () => {
      const result = registerSchema.safeParse({
        fullName: 'Ram Bahadur',
        email: 'ram@example.com',
        phone: '+977 9800000000',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched confirm password', () => {
      const result = registerSchema.safeParse({
        fullName: 'Ram Bahadur',
        email: 'ram@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'DifferentPassword456!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe("Passwords don't match");
      }
    });

    it('rejects full name with fewer than 3 characters', () => {
      const result = registerSchema.safeParse({
        fullName: 'R',
        email: 'ram@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Admin Auth Form Validation Tests', () => {
    const adminLoginSchema = z.object({
      email: z.string().email('Please enter a valid administrator email'),
      password: z.string().min(1, 'Password is required'),
    });

    const adminRegisterSchema = z
      .object({
        fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
        email: z.string().email('Please enter a valid administrator email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });

    it('accepts valid admin credentials', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@highschoolyouthclub.org',
        password: 'SecureAdminPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty admin password', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@highschoolyouthclub.org',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid admin registration with matching passwords', () => {
      const result = adminRegisterSchema.safeParse({
        fullName: 'Administrator Person',
        email: 'admin@highschoolyouthclub.org',
        password: 'SuperSecurePassword@2026',
        confirmPassword: 'SuperSecurePassword@2026',
      });
      expect(result.success).toBe(true);
    });

    it('rejects admin registration when passwords do not match', () => {
      const result = adminRegisterSchema.safeParse({
        fullName: 'Administrator Person',
        email: 'admin@highschoolyouthclub.org',
        password: 'SuperSecurePassword@2026',
        confirmPassword: 'MismatchPassword@2026',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Passwords do not match');
      }
    });

    it('rejects admin registration when password is shorter than 8 characters', () => {
      const result = adminRegisterSchema.safeParse({
        fullName: 'Administrator Person',
        email: 'admin@highschoolyouthclub.org',
        password: 'short',
        confirmPassword: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('accepts admin registration without adminSecurityKey', () => {
      const result = adminRegisterSchema.safeParse({
        fullName: 'Administrator Person',
        email: 'admin@highschoolyouthclub.org',
        password: 'SuperSecurePassword@2026',
        confirmPassword: 'SuperSecurePassword@2026',
      });
      expect(result.success).toBe(true);
    });
  });
});
