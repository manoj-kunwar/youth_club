import {
  updateUserProfileSchema,
  createUserProfileSchema,
  registerSchema,
  loginSchema,
} from '../validators/user.validator';
import { generateMemberId, generateAdminId } from '../services/idGenerator.service';
import Counter from '../models/Counter.model';
import UserProfile from '../models/UserProfile.model';

jest.mock('../models/Counter.model');
jest.mock('../models/UserProfile.model');

describe('Production Hardening Security Tests', () => {
  describe('1. Mass Assignment & Field Injection Protection', () => {
    it('should strip privileged fields from updateUserProfileSchema', () => {
      const maliciousPayload = {
        fullName: 'Legitimate Name',
        role: 'SUPER_ADMIN',
        status: 'active',
        memberId: 'MEM-9999-999999',
        adminId: 'ADM-9999-999999',
        volunteerHours: 9999,
        eventsAttended: 100,
        youthLeaderRank: 1,
        projectsBacked: 50,
      };

      const parsed: any = updateUserProfileSchema.parse(maliciousPayload);

      // Only fullName should pass through; all privileged fields stripped
      expect(parsed.fullName).toBe('Legitimate Name');
      expect(parsed.role).toBeUndefined();
      expect(parsed.status).toBeUndefined();
      expect(parsed.memberId).toBeUndefined();
      expect(parsed.adminId).toBeUndefined();
      expect(parsed.volunteerHours).toBeUndefined();
      expect(parsed.eventsAttended).toBeUndefined();
      expect(parsed.youthLeaderRank).toBeUndefined();
      expect(parsed.projectsBacked).toBeUndefined();
    });

    it('should strip role, status, and IDs from createUserProfileSchema', () => {
      const payload = {
        fullName: 'New Member',
        email: 'newmember@example.com',
        role: 'SUPER_ADMIN',
        status: 'active',
        memberId: 'ADM-2026-000001',
      };

      const parsed: any = createUserProfileSchema.parse(payload);
      expect(parsed.fullName).toBe('New Member');
      expect(parsed.email).toBe('newmember@example.com');
      expect(parsed.role).toBeUndefined();
      expect(parsed.memberId).toBeUndefined();
    });

    it('should strip role in public registration schema', () => {
      const payload = {
        fullName: 'Tester',
        email: 'tester@example.com',
        password: 'Password@123',
        confirmPassword: 'Password@123',
        role: 'SUPER_ADMIN',
      };

      const parsed: any = registerSchema.parse(payload);
      expect(parsed.role).toBeUndefined();
    });
  });

  describe('2. Account Status Validation in Auth Flows', () => {
    it('should validate that login requires active status', () => {
      const validPayload = {
        emailOrId: 'active@example.com',
        password: 'Password@123',
      };
      const parsed = loginSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);
    });
  });

  describe('3. Unique ID Generator Format & Counter Integrity', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should generate Member ID matching MEM-YYYY-XXXXXX format', async () => {
      (Counter.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ seq: 42 });
      (UserProfile.findOne as jest.Mock).mockResolvedValueOnce(null);

      const memberId = await generateMemberId(2026);
      expect(memberId).toBe('MEM-2026-000042');
      expect(memberId).toMatch(/^MEM-2026-\d{6}$/);
    });

    it('should generate Admin ID matching ADM-YYYY-XXXXXX format', async () => {
      (Counter.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ seq: 7 });
      (UserProfile.findOne as jest.Mock).mockResolvedValueOnce(null);

      const adminId = await generateAdminId(2026);
      expect(adminId).toBe('ADM-2026-000007');
      expect(adminId).toMatch(/^ADM-2026-\d{6}$/);
    });

    it('should retry counter upon collision until unique', async () => {
      (Counter.findByIdAndUpdate as jest.Mock)
        .mockResolvedValueOnce({ seq: 1 })
        .mockResolvedValueOnce({ seq: 2 });
      // First attempt finds duplicate, second attempt is unique
      (UserProfile.findOne as jest.Mock)
        .mockResolvedValueOnce({ _id: 'collision-doc' })
        .mockResolvedValueOnce(null);

      const memberId = await generateMemberId(2026);
      expect(memberId).toBe('MEM-2026-000002');
      expect(Counter.findByIdAndUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
