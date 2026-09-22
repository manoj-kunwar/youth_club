import { z } from 'zod';
import { paginationSchema } from './user.validator';

// ─── Notice Validators ────────────────────────────────────────────────────

const noticePriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
const noticeCategoryEnum = z.enum([
  'general', 'event', 'urgent', 'recruitment', 'financial', 'administrative', 'other',
]);

export const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().min(1, 'Content is required').max(50000),
  summary: z.string().max(500).optional().or(z.literal('')),
  category: noticeCategoryEnum.optional().default('general'),
  priority: noticePriorityEnum.optional().default('medium'),
  publishedAt: z.string().datetime({ offset: true }).optional().or(z.literal('')),
  expiryDate: z.string().datetime({ offset: true }).optional().or(z.literal('')),
  attachmentUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
  pinned: z.boolean().optional().default(false),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export const noticeFilterSchema = paginationSchema.extend({
  category: noticeCategoryEnum.optional(),
  priority: noticePriorityEnum.optional(),
  published: z.coerce.boolean().optional(),
  pinned: z.coerce.boolean().optional(),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
export type NoticeFilterParams = z.infer<typeof noticeFilterSchema>;

// ─── Gallery Validators ───────────────────────────────────────────────────

export const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
  featureType: z.enum(['photo', 'video', 'document']).optional().default('photo'),
  mediaUrl: z.string().url('Media URL must be a valid URL'),
  cloudinaryPublicId: z.string().min(1, 'Cloudinary public ID is required'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  folder: z.string().max(100).optional().or(z.literal('')),
  eventId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid event ID').optional().or(z.literal('')),
});

export const updateGallerySchema = createGallerySchema.partial();

export const galleryFilterSchema = paginationSchema.extend({
  featureType: z.enum(['photo', 'video', 'document']).optional(),
  folder: z.string().optional(),
  eventId: z.string().optional(),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type GalleryFilterParams = z.infer<typeof galleryFilterSchema>;

// ─── Activity Validators ──────────────────────────────────────────────────

const activityCategoryEnum = z.enum([
  'environment', 'education', 'health', 'culture', 'sports', 'social_work', 'other',
]);

export const createActivitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(10000),
  category: activityCategoryEnum,
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  date: z.string().datetime({ offset: true }).or(z.string().date()),
  location: z.string().max(200).optional().or(z.literal('')),
  organizer: z.string().max(100).optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

export const updateActivitySchema = createActivitySchema.partial();

export const activityFilterSchema = paginationSchema.extend({
  category: activityCategoryEnum.optional(),
  published: z.coerce.boolean().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type ActivityFilterParams = z.infer<typeof activityFilterSchema>;

// ─── Achievement Validators ───────────────────────────────────────────────

const achievementCategoryEnum = z.enum([
  'award', 'recognition', 'milestone', 'partnership', 'project', 'other',
]);

export const createAchievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  date: z.string().datetime({ offset: true }).or(z.string().date()),
  category: achievementCategoryEnum,
  image: z.string().url().optional().or(z.literal('')),
  recipient: z.string().max(100).optional().or(z.literal('')),
  organization: z.string().max(100).optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

export const updateAchievementSchema = createAchievementSchema.partial();

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;

// ─── Member Validators ────────────────────────────────────────────────────

const memberRoleEnum = z.enum([
  'president', 'vice_president', 'secretary', 'treasurer', 'executive', 'member', 'volunteer', 'advisor',
]);

export const createMemberSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  nepaliName: z.string().max(100).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  profileImage: z.string().url().optional().or(z.literal('')),
  role: memberRoleEnum.optional().default('member'),
  position: z.string().max(100).optional().or(z.literal('')),
  ward: z.string().max(50).optional().or(z.literal('')),
  joinedDate: z.string().date().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'honorary']).optional().default('active'),
  bio: z.string().max(2000).optional().or(z.literal('')),
  skills: z.array(z.string().max(50)).optional().default([]),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
  }).optional().default({}),
  isVolunteer: z.boolean().optional().default(false),
});

export const updateMemberSchema = createMemberSchema.partial();

export const memberFilterSchema = paginationSchema.extend({
  role: memberRoleEnum.optional(),
  status: z.enum(['active', 'inactive', 'honorary']).optional(),
  isVolunteer: z.coerce.boolean().optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type MemberFilterParams = z.infer<typeof memberFilterSchema>;

// ─── Contact Message Validators ───────────────────────────────────────────

export const createContactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number cannot exceed 25 characters')
    .optional()
    .or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(200, 'Subject cannot exceed 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message cannot exceed 5000 characters'),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

// ─── SiteContent Validators ───────────────────────────────────────────────

export const upsertSiteContentSchema = z.object({
  sectionKey: z.enum(['hero', 'about', 'mission', 'contact', 'footer']),
  contentPayload: z.record(z.string(), z.unknown()).refine(
    (v) => Object.keys(v).length > 0,
    'Content payload cannot be empty'
  ),
});

export type UpsertSiteContentInput = z.infer<typeof upsertSiteContentSchema>;

// ─── SiteSettings Validators ──────────────────────────────────────────────

export const updateSiteSettingsSchema = z.object({
  orgName: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().max(20).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal('')),
    whatsapp: z.string().max(100).optional().or(z.literal('')),
  }).optional(),
  portalConfig: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
