import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from './errorHandler';
import { UserRole } from '../models/UserProfile.model';

// ─── Permission Map ───────────────────────────────────────────────────────
/**
 * Defines what each role is permitted to do.
 * SUPER_ADMIN has unrestricted access — always checked first.
 */
export type Permission =
  | 'content.read'
  | 'content.write'
  | 'events.read'
  | 'events.create'
  | 'events.update'
  | 'events.delete'
  | 'events.publish'
  | 'gallery.read'
  | 'gallery.upload'
  | 'gallery.delete'
  | 'members.read'
  | 'members.create'
  | 'members.update'
  | 'members.delete'
  | 'notices.read'
  | 'notices.create'
  | 'notices.update'
  | 'notices.delete'
  | 'notices.publish'
  | 'settings.read'
  | 'settings.update'
  | 'audit.read'
  | 'users.read'
  | 'users.update'
  | 'users.delete';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    // Full unrestricted access — all permissions
    'content.read', 'content.write',
    'events.read', 'events.create', 'events.update', 'events.delete', 'events.publish',
    'gallery.read', 'gallery.upload', 'gallery.delete',
    'members.read', 'members.create', 'members.update', 'members.delete',
    'notices.read', 'notices.create', 'notices.update', 'notices.delete', 'notices.publish',
    'settings.read', 'settings.update',
    'audit.read',
    'users.read', 'users.update', 'users.delete',
  ],
  ADMIN: [
    'content.read', 'content.write',
    'events.read', 'events.create', 'events.update', 'events.delete', 'events.publish',
    'gallery.read', 'gallery.upload', 'gallery.delete',
    'members.read', 'members.create', 'members.update', 'members.delete',
    'notices.read', 'notices.create', 'notices.update', 'notices.delete', 'notices.publish',
    'settings.read', 'settings.update',
    'audit.read',
    'users.read', 'users.update', 'users.delete',
  ],
  CONTENT_MANAGER: [
    'content.read', 'content.write',
    'events.read', 'events.create', 'events.update',
    'gallery.read', 'gallery.upload',
    'notices.read', 'notices.create', 'notices.update',
    'members.read',
  ],
  EVENT_MANAGER: [
    'events.read', 'events.create', 'events.update', 'events.publish',
    'gallery.read', 'gallery.upload',
    'notices.read',
    'members.read',
  ],
  VOLUNTEER: [
    'events.read',
    'gallery.read',
    'notices.read',
    'members.read',
  ],
  MEMBER: [
    'events.read',
    'gallery.read',
    'notices.read',
    'members.read',
  ],
};

// ─── hasPermission Helper ─────────────────────────────────────────────────
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === 'SUPER_ADMIN') return true; // Unrestricted
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// ─── requirePermission Middleware ─────────────────────────────────────────
/**
 * Authorization middleware — checks if the authenticated user has a specific permission.
 * Must be used AFTER verifyAuth.
 */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { role } = req.user.profile;

    if (!hasPermission(role, permission)) {
      throw new ForbiddenError(
        `Your role (${role}) does not have permission to perform: ${permission}`
      );
    }

    next();
  };
}

// ─── requireRole Middleware ───────────────────────────────────────────────
/**
 * Alternative: checks if user has one of the specified roles.
 * Less granular than requirePermission — use sparingly.
 */
export function requireRole(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { role } = req.user.profile;

    if (!roles.includes(role)) {
      throw new ForbiddenError(
        `Access restricted to roles: ${roles.join(', ')}. Your role: ${role}`
      );
    }

    next();
  };
}

export { ROLE_PERMISSIONS };
