import { z } from 'zod';
import { paginationSchema } from './user.validator';

// ─── Event Validators ─────────────────────────────────────────────────────

const eventTypeEnum = z.enum([
  'cultural', 'sports', 'educational', 'community_service',
  'fundraising', 'meeting', 'celebration', 'other',
]);

const eventStatusEnum = z.enum(['draft', 'published', 'cancelled', 'completed', 'archived']);

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(10000),
  shortDescription: z.string().max(300).optional().or(z.literal('')),
  eventType: eventTypeEnum,
  date: z.string().datetime({ offset: true }).or(z.string().date()),
  startTime: z.string().optional().or(z.literal('')),
  endTime: z.string().optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required').max(200),
  ward: z.string().optional().or(z.literal('')),
  organizer: z.string().min(1).max(100).optional().default('High School Youth Club'),
  coverImage: z.string().url().optional().or(z.literal('')),
  galleryImages: z.array(z.string().url()).optional().default([]),
  status: eventStatusEnum.optional().default('draft'),
  registrationEnabled: z.boolean().optional().default(false),
  registrationDeadline: z.string().datetime({ offset: true }).optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

export const updateEventSchema = createEventSchema.partial();

export const eventFilterSchema = paginationSchema.extend({
  status: eventStatusEnum.optional(),
  eventType: eventTypeEnum.optional(),
  published: z.coerce.boolean().optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFilterParams = z.infer<typeof eventFilterSchema>;
