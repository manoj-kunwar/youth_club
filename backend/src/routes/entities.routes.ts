import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import {
  getNotices, getNoticeById, getNoticeBySlug,
  createNotice, updateNotice, deleteNotice, publishNotice, pinNotice,
  getGallery, getGalleryItemById, createGalleryItem, updateGalleryItem, deleteGalleryItem,
} from '../controllers/entities.controller';
import {
  getActivities, getActivityById, getActivityBySlug, createActivity, updateActivity, deleteActivity,
  getAchievements, getAchievementById, createAchievement, updateAchievement, deleteAchievement,
  getMembers, getMemberById, createMember, updateMember, deleteMember,
  getAllSiteContent, getSiteContentSection, upsertSiteContent,
  getSiteSettings, updateSiteSettings, getPublicStats,
  submitContact, getContactMessages, markContactRead, archiveContact, deleteContact,
  getAuditLogs,
} from '../controllers/admin.controller';

import { apiCache } from '../middleware/cache';

// ─── Notice Routes ─────────────────────────────────────────────────────────
export const noticeRouter = Router();
noticeRouter.get('/', apiCache(30), getNotices);
noticeRouter.get('/slug/:slug', getNoticeBySlug);
noticeRouter.get('/:id', getNoticeById);
noticeRouter.post('/', verifyAuth, requirePermission('notices.create'), createNotice);
noticeRouter.patch('/:id', verifyAuth, requirePermission('notices.update'), updateNotice);
noticeRouter.patch('/:id/publish', verifyAuth, requirePermission('notices.publish'), publishNotice);
noticeRouter.patch('/:id/pin', verifyAuth, requirePermission('notices.update'), pinNotice);
noticeRouter.delete('/:id', verifyAuth, requirePermission('notices.delete'), deleteNotice);

// ─── Gallery Routes ────────────────────────────────────────────────────────
export const galleryRouter = Router();
galleryRouter.get('/', apiCache(30), getGallery);
galleryRouter.get('/:id', getGalleryItemById);
galleryRouter.post('/', verifyAuth, requirePermission('gallery.upload'), createGalleryItem);
galleryRouter.patch('/:id', verifyAuth, requirePermission('gallery.upload'), updateGalleryItem);
galleryRouter.delete('/:id', verifyAuth, requirePermission('gallery.delete'), deleteGalleryItem);

// ─── Activity Routes ───────────────────────────────────────────────────────
export const activityRouter = Router();
activityRouter.get('/', apiCache(30), getActivities);
activityRouter.get('/slug/:slug', getActivityBySlug);
activityRouter.get('/:id', getActivityById);
activityRouter.post('/', verifyAuth, requirePermission('events.create'), createActivity);
activityRouter.patch('/:id', verifyAuth, requirePermission('events.update'), updateActivity);
activityRouter.delete('/:id', verifyAuth, requirePermission('events.delete'), deleteActivity);

// ─── Achievement Routes ────────────────────────────────────────────────────
export const achievementRouter = Router();
achievementRouter.get('/', apiCache(30), getAchievements);
achievementRouter.get('/:id', getAchievementById);
achievementRouter.post('/', verifyAuth, requirePermission('content.write'), createAchievement);
achievementRouter.patch('/:id', verifyAuth, requirePermission('content.write'), updateAchievement);
achievementRouter.delete('/:id', verifyAuth, requirePermission('content.write'), deleteAchievement);

// ─── Member Routes ─────────────────────────────────────────────────────────
export const memberRouter = Router();
memberRouter.get('/', getMembers);
memberRouter.get('/:id', getMemberById);
memberRouter.post('/', verifyAuth, requirePermission('members.create'), createMember);
memberRouter.patch('/:id', verifyAuth, requirePermission('members.update'), updateMember);
memberRouter.delete('/:id', verifyAuth, requirePermission('members.delete'), deleteMember);

// ─── Site Content Routes ───────────────────────────────────────────────────
export const siteContentRouter = Router();
siteContentRouter.get('/stats', apiCache(30), getPublicStats);
siteContentRouter.get('/public/stats', apiCache(30), getPublicStats);
siteContentRouter.get('/', getAllSiteContent);
siteContentRouter.get('/:section', getSiteContentSection);
siteContentRouter.put('/', verifyAuth, requirePermission('content.write'), upsertSiteContent);
siteContentRouter.put('/:section', verifyAuth, requirePermission('content.write'), upsertSiteContent);

// ─── Site Settings Routes ──────────────────────────────────────────────────
export const siteSettingsRouter = Router();
siteSettingsRouter.get('/', apiCache(30), getSiteSettings);
siteSettingsRouter.patch('/', verifyAuth, requirePermission('settings.update'), updateSiteSettings);
siteSettingsRouter.put('/', verifyAuth, requirePermission('settings.update'), updateSiteSettings);

// ─── Contact Routes ────────────────────────────────────────────────────────
const contactFormRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many form submissions. Please wait a moment.' },
  },
});

export const contactRouter = Router();
contactRouter.post('/', contactFormRateLimit, submitContact); // Public — rate limited to 5 submissions/min
contactRouter.get('/', verifyAuth, requirePermission('content.read'), getContactMessages);
contactRouter.patch('/:id/read', verifyAuth, requirePermission('content.read'), markContactRead);
contactRouter.patch('/:id/archive', verifyAuth, requirePermission('content.read'), archiveContact);
contactRouter.delete('/:id', verifyAuth, requirePermission('content.read'), deleteContact);

// ─── Audit Log Routes ──────────────────────────────────────────────────────
export const auditLogRouter = Router();
auditLogRouter.get('/', verifyAuth, requirePermission('audit.read'), getAuditLogs);
