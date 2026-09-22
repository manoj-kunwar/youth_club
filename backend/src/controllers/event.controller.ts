import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess, sendCreated, sendPaginated, sendError } from '../utils/apiResponse';
import * as eventService from '../services/event.service';
import * as entitiesService from '../services/entities.service';
import { recordAction, AuditActions } from '../services/auditLog.service';
import {
  createEventSchema,
  updateEventSchema,
  eventFilterSchema,
} from '../validators/event.validator';

// ─── GET /api/v1/events ────────────────────────────────────────────────────
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const params = eventFilterSchema.parse({ ...req.query });
  const { data, pagination } = await eventService.listEvents(params);
  sendPaginated(res, data, pagination);
});

// ─── GET /api/v1/events/:id ───────────────────────────────────────────────
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventById(String(req.params['id']));
  sendSuccess(res, event);
});

// ─── GET /api/v1/events/slug/:slug ────────────────────────────────────────
export const getEventBySlug = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventBySlug(String(req.params['slug']));
  sendSuccess(res, event);
});

// ─── POST /api/v1/events ──────────────────────────────────────────────────
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const data = createEventSchema.parse(req.body);
  const userId = req.user!.profile._id;

  const event = await eventService.createEvent(data, userId);

  await recordAction({
    userId,
    action: AuditActions.EVENT_CREATED,
    resource: 'Event',
    resourceId: event._id.toString(),
    metadata: { title: event.title },
    req,
  });

  sendCreated(res, event, 'Event created successfully');
});

// ─── PATCH /api/v1/events/:id ─────────────────────────────────────────────
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const data = updateEventSchema.parse(req.body);
  const id = String(req.params['id']);
  const event = await eventService.updateEvent(id, data);

  await recordAction({
    userId: req.user!.profile._id,
    action: AuditActions.EVENT_UPDATED,
    resource: 'Event',
    resourceId: event._id.toString(),
    metadata: { changes: Object.keys(data) },
    req,
  });

  sendSuccess(res, event, 'Event updated successfully');
});

// ─── PATCH /api/v1/events/:id/publish ────────────────────────────────────
export const publishEvent = asyncHandler(async (req: Request, res: Response) => {
  const { published } = req.body as { published: boolean };
  if (typeof published !== 'boolean') {
    sendError(res, 400, 'VALIDATION_ERROR', '"published" must be a boolean');
    return;
  }

  const id = String(req.params['id']);
  const event = await eventService.publishEvent(id, published);

  await recordAction({
    userId: req.user!.profile._id,
    action: published ? AuditActions.EVENT_PUBLISHED : AuditActions.EVENT_ARCHIVED,
    resource: 'Event',
    resourceId: event._id.toString(),
    req,
  });

  sendSuccess(res, event, `Event ${published ? 'published' : 'unpublished'} successfully`);
});

// ─── DELETE /api/v1/events/:id ────────────────────────────────────────────
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  // Check event exists before deletion (to get title for audit)
  const event = await eventService.getEventById(id);
  const title = event.title;

  await eventService.deleteEvent(id);

  await recordAction({
    userId: req.user!.profile._id,
    action: AuditActions.EVENT_DELETED,
    resource: 'Event',
    resourceId: id,
    metadata: { title },
    req,
  });

  sendSuccess(res, null, 'Event deleted successfully');
});

// ─── POST /api/v1/events/:id/rsvp ─────────────────────────────────────────
export const rsvpEvent = asyncHandler(async (req: Request, res: Response) => {
  const eventId = String(req.params['id']);
  const { name, email, phone, notes } = req.body;

  if (!name || !email) {
    sendError(res, 400, 'VALIDATION_ERROR', 'Name and email are required for RSVP');
    return;
  }

  const userId = req.user?.profile?._id?.toString();
  const registration = await entitiesService.registerForEvent(
    eventId,
    { name, email, phone, notes },
    userId
  );

  sendSuccess(res, registration, 'RSVP confirmed successfully');
});

// ─── GET /api/v1/events/user/my-events ────────────────────────────────────
export const getUserEvents = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.profile._id.toString();
  const events = await entitiesService.getUserRegisteredEvents(userId);
  sendSuccess(res, events);
});
