import { Router } from 'express';
import { verifyAuth, optionalAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { apiCache } from '../middleware/cache';
import {
  getEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  publishEvent,
  deleteEvent,
  rsvpEvent,
  getUserEvents,
} from '../controllers/event.controller';

const router = Router();

// ─── User Registered Events (must precede :id parameter) ───────────────────
router.get('/user/my-events', verifyAuth, getUserEvents);

// ─── Public Routes ─────────────────────────────────────────────────────────
// Only published events are returned to unauthenticated users (filtered in service)
router.get('/', apiCache(30), getEvents);
router.get('/slug/:slug', getEventBySlug);
router.get('/:id', getEventById);
router.post('/:id/rsvp', optionalAuth, rsvpEvent);

// ─── Protected Routes ─────────────────────────────────────────────────────
router.post('/', verifyAuth, requirePermission('events.create'), createEvent);
router.patch('/:id', verifyAuth, requirePermission('events.update'), updateEvent);
router.patch('/:id/publish', verifyAuth, requirePermission('events.publish'), publishEvent);
router.delete('/:id', verifyAuth, requirePermission('events.delete'), deleteEvent);

export default router;
