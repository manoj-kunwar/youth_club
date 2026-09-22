import { hasPermission, ROLE_PERMISSIONS } from '../middleware/rbac';
import { UserRole } from '../models/UserProfile.model';

describe('RBAC & Role Protection Tests', () => {
  describe('SUPER_ADMIN Privileges', () => {
    it('should grant SUPER_ADMIN unrestricted access to all permissions', () => {
      expect(hasPermission('SUPER_ADMIN', 'content.read')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'content.write')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'events.create')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'events.delete')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'users.update')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'users.delete')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'audit.read')).toBe(true);
    });
  });

  describe('ADMIN Privileges', () => {
    it('should grant ADMIN management access including users.delete', () => {
      expect(hasPermission('ADMIN', 'events.create')).toBe(true);
      expect(hasPermission('ADMIN', 'events.update')).toBe(true);
      expect(hasPermission('ADMIN', 'events.delete')).toBe(true);
      expect(hasPermission('ADMIN', 'notices.publish')).toBe(true);
      expect(hasPermission('ADMIN', 'users.read')).toBe(true);
      expect(hasPermission('ADMIN', 'users.update')).toBe(true);
      expect(hasPermission('ADMIN', 'users.delete')).toBe(true);
    });
  });

  describe('MEMBER Restrictions', () => {
    it('should restrict MEMBER from performing any administrative writes or deletes', () => {
      expect(hasPermission('MEMBER', 'events.read')).toBe(true);
      expect(hasPermission('MEMBER', 'notices.read')).toBe(true);
      expect(hasPermission('MEMBER', 'gallery.read')).toBe(true);
      expect(hasPermission('MEMBER', 'members.read')).toBe(true);

      // Must NOT have mutation permissions
      expect(hasPermission('MEMBER', 'events.create')).toBe(false);
      expect(hasPermission('MEMBER', 'events.update')).toBe(false);
      expect(hasPermission('MEMBER', 'events.delete')).toBe(false);
      expect(hasPermission('MEMBER', 'events.publish')).toBe(false);
      expect(hasPermission('MEMBER', 'notices.create')).toBe(false);
      expect(hasPermission('MEMBER', 'notices.delete')).toBe(false);
      expect(hasPermission('MEMBER', 'gallery.upload')).toBe(false);
      expect(hasPermission('MEMBER', 'users.read')).toBe(false);
      expect(hasPermission('MEMBER', 'users.update')).toBe(false);
      expect(hasPermission('MEMBER', 'users.delete')).toBe(false);
      expect(hasPermission('MEMBER', 'settings.update')).toBe(false);
      expect(hasPermission('MEMBER', 'audit.read')).toBe(false);
    });
  });

  describe('Role Permissions Consistency', () => {
    it('should have all roles defined in ROLE_PERMISSIONS', () => {
      const roles: UserRole[] = [
        'SUPER_ADMIN',
        'ADMIN',
        'CONTENT_MANAGER',
        'EVENT_MANAGER',
        'VOLUNTEER',
        'MEMBER',
      ];

      for (const role of roles) {
        expect(ROLE_PERMISSIONS[role]).toBeDefined();
        expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
      }
    });
  });
});
