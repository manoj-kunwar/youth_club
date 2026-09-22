import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import healthRoutes from './health.routes';
import eventRoutes from './event.routes';
import userRoutes from './user.routes';
import uploadRoutes from './upload.routes';
import {
  noticeRouter,
  galleryRouter,
  activityRouter,
  achievementRouter,
  memberRouter,
  siteContentRouter,
  siteSettingsRouter,
  contactRouter,
  auditLogRouter,
} from './entities.routes';

import { config } from '../config/env';

const router = Router();

// ─── Rate Limiters for Sensitive Endpoints ────────────────────────────────
const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: config.NODE_ENV === 'development' || config.NODE_ENV === 'test' ? 500 : (config.AUTH_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many auth requests. Please wait a moment.' },
  },
});

import authRoutes from './auth.routes';

// ─── Mount All Route Groups ───────────────────────────────────────────────
router.use('/', healthRoutes);
router.use('/auth', authRateLimit, authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/notices', noticeRouter);
router.use('/gallery', galleryRouter);
router.use('/activities', activityRouter);
router.use('/achievements', achievementRouter);
router.use('/members', memberRouter);
router.use('/admin/members', memberRouter);
import { getPublicStats } from '../controllers/admin.controller';

router.use('/site-content', siteContentRouter);
router.use('/content', siteContentRouter);
router.get('/stats', getPublicStats);
router.use('/site-settings', siteSettingsRouter);
router.use('/settings', siteSettingsRouter);
router.use('/contact', contactRouter);
router.use('/contacts', contactRouter);
router.use('/admin/contacts', contactRouter);
router.use('/audit-logs', auditLogRouter);
router.use('/audit', auditLogRouter);
router.use('/admin/audit', auditLogRouter);
router.use('/uploads', uploadRoutes);
router.use('/upload', uploadRoutes);

export default router;
