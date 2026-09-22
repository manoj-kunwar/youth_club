import { Request } from 'express';
import AuditLog from '../models/AuditLog.model';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────
interface AuditLogEntry {
  userId: mongoose.Types.ObjectId | string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  req?: Request;
}

// ─── recordAction ─────────────────────────────────────────────────────────
/**
 * Creates an immutable audit log entry for every sensitive admin action.
 * Fire-and-forget — errors are logged but do NOT fail the parent request.
 */
export async function recordAction(entry: AuditLogEntry): Promise<void> {
  try {
    await AuditLog.create({
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      ipAddress: entry.req ? getClientIp(entry.req) : undefined,
      userAgent: entry.req?.headers['user-agent'],
      metadata: entry.metadata,
      timestamp: new Date(),
    });
  } catch (err) {
    // Log but don't throw — audit failures must NEVER break the main operation
    logger.error('Failed to write audit log entry:', {
      error: (err as Error).message,
      action: entry.action,
      resource: entry.resource,
    });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim() ?? req.ip ?? 'unknown';
  }
  return req.ip ?? 'unknown';
}

// ─── Action Constants ─────────────────────────────────────────────────────
export const AuditActions = {
  // Member Specific Auth Actions
  MEMBER_REGISTERED: 'member.registered',
  MEMBER_LOGIN: 'member.login',
  MEMBER_LOGIN_FAILED: 'member.login_failed',
  MEMBER_PASSWORD_CHANGED: 'member.password_changed',
  MEMBER_LOGOUT: 'member.logout',

  // Admin Specific Auth Actions
  ADMIN_CREATED: 'admin.created',
  ADMIN_LOGIN: 'admin.login',
  ADMIN_LOGIN_FAILED: 'admin.login_failed',
  ADMIN_PASSWORD_CHANGED: 'admin.password_changed',
  ADMIN_LOGOUT: 'admin.logout',

  // Security & Auth Common
  PASSWORD_CHANGED: 'password.changed',
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  SESSIONS_REVOKED: 'sessions.revoked',
  // User
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_ROLE_CHANGED: 'user.role_changed',
  USER_STATUS_CHANGED: 'user.status_changed',
  USER_DELETED: 'user.deleted',
  // Events
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_PUBLISHED: 'event.published',
  EVENT_ARCHIVED: 'event.archived',
  EVENT_DELETED: 'event.deleted',
  // Gallery
  GALLERY_UPLOADED: 'gallery.uploaded',
  GALLERY_DELETED: 'gallery.deleted',
  // Notices
  NOTICE_CREATED: 'notice.created',
  NOTICE_UPDATED: 'notice.updated',
  NOTICE_PUBLISHED: 'notice.published',
  NOTICE_PINNED: 'notice.pinned',
  NOTICE_DELETED: 'notice.deleted',
  // Members
  MEMBER_CREATED: 'member.created',
  MEMBER_UPDATED: 'member.updated',
  MEMBER_DELETED: 'member.deleted',
  // Activities
  ACTIVITY_CREATED: 'activity.created',
  ACTIVITY_UPDATED: 'activity.updated',
  ACTIVITY_DELETED: 'activity.deleted',
  // Achievements
  ACHIEVEMENT_CREATED: 'achievement.created',
  ACHIEVEMENT_UPDATED: 'achievement.updated',
  ACHIEVEMENT_DELETED: 'achievement.deleted',
  // Site
  SITE_CONTENT_UPDATED: 'site.content_updated',
  SITE_SETTINGS_UPDATED: 'site.settings_updated',
  // Contact
  CONTACT_READ: 'contact.read',
  CONTACT_ARCHIVED: 'contact.archived',
  CONTACT_DELETED: 'contact.deleted',
} as const;

export type AuditAction = typeof AuditActions[keyof typeof AuditActions];
