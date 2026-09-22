// =============================================================================
// HIGH SCHOOL YOUTH CLUB — Shared TypeScript Interfaces
// These mirror the Mongoose schemas and are used across frontend and API layer
// =============================================================================

// ─── Common Types ─────────────────────────────────────────────────────────

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CONTENT_MANAGER'
  | 'EVENT_MANAGER'
  | 'VOLUNTEER'
  | 'MEMBER';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed' | 'archived';

export type EventType =
  | 'cultural'
  | 'sports'
  | 'educational'
  | 'community_service'
  | 'fundraising'
  | 'meeting'
  | 'celebration'
  | 'other';

export type ActivityCategory =
  | 'environment'
  | 'education'
  | 'health'
  | 'culture'
  | 'sports'
  | 'social_work'
  | 'other';

export type AchievementCategory =
  | 'award'
  | 'recognition'
  | 'milestone'
  | 'partnership'
  | 'project'
  | 'other';

export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent';

export type NoticeCategory =
  | 'general'
  | 'event'
  | 'urgent'
  | 'recruitment'
  | 'financial'
  | 'administrative'
  | 'other';

export type MemberRole =
  | 'president'
  | 'vice_president'
  | 'secretary'
  | 'treasurer'
  | 'executive'
  | 'member'
  | 'volunteer'
  | 'advisor';

export type MemberStatus = 'active' | 'inactive' | 'honorary';

export type SiteContentSection = 'hero' | 'about' | 'mission' | 'contact' | 'footer';

export type GalleryFeatureType = 'photo' | 'video' | 'document';

// ─── API Response Wrappers ────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ─── Entities ────────────────────────────────────────────────────────────

export interface UserProfile {
  _id: string;
  supabaseUserId?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  interests?: string[];
  bloodGroup?: string;
  dateOfBirth?: string;
  memberId?: string;
  adminId?: string;
  role: UserRole;
  status: UserStatus;
  volunteerHours?: number;
  eventsAttended?: number;
  youthLeaderRank?: string;
  projectsBacked?: number;
  volunteerActivities?: Array<{
    title: string;
    hours: number;
    date: string;
    description?: string;
  }>;
  attendedEvents?: string[];
  backedProjects?: string[];
  isEmailVerified?: boolean;
  lastSignInAt?: string;
  authProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveSession {
  sessionId: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface SecurityInfo {
  accountId: string;
  email: string;
  phone?: string;
  isEmailVerified: boolean;
  isPhoneVerified?: boolean;
  authProvider: string;
  lastSignInAt: string;
  activeSessions: ActiveSession[];
  currentSessionId?: string;
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  eventType: EventType;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  ward?: string;
  organizer: string;
  coverImage?: string;
  galleryImages: string[];
  status: EventStatus;
  registrationEnabled: boolean;
  registrationDeadline?: string;
  published: boolean;
  createdBy: string | UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Gallery {
  _id: string;
  title: string;
  description?: string;
  featureType: GalleryFeatureType;
  mediaUrl: string;
  cloudinaryPublicId: string;
  thumbnailUrl?: string;
  folder?: string;
  eventId?: string | Event;
  uploadedBy: string | UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: ActivityCategory;
  coverImage?: string;
  status: 'draft' | 'published' | 'archived';
  date: string;
  location?: string;
  organizer?: string;
  published: boolean;
  createdBy: string | UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: AchievementCategory;
  image?: string;
  recipient?: string;
  organization?: string;
  published: boolean;
  createdBy: string | UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishedAt?: string;
  expiryDate?: string;
  attachmentUrl?: string;
  author: string | UserProfile;
  published: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  _id: string;
  fullName: string;
  nepaliName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role: MemberRole;
  position?: string;
  ward?: string;
  joinedDate?: string;
  status: MemberStatus;
  bio?: string;
  skills: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  isVolunteer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContent {
  _id: string;
  sectionKey: SiteContentSection;
  contentPayload: Record<string, unknown>;
  updatedAt: string;
}

export interface SiteSettings {
  _id: string;
  orgName: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  portalConfig: {
    clubNepaliName?: string;
    registrationNumber?: string;
    establishedYear?: number;
    allowPublicRegistration?: boolean;
    secondaryPhone?: string;
    [key: string]: unknown;
  };
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  userId: string | UserProfile;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

// ─── Query Params ────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface EventFilterParams extends PaginationParams {
  status?: EventStatus;
  eventType?: EventType;
  published?: boolean;
}

export interface NoticeFilterParams extends PaginationParams {
  category?: NoticeCategory;
  priority?: NoticePriority;
  published?: boolean;
  pinned?: boolean;
}

export interface MemberFilterParams extends PaginationParams {
  role?: MemberRole;
  status?: MemberStatus;
  isVolunteer?: boolean;
}

export interface PublicStats {
  activeVolunteers: number;
  projectsExecuted: number;
  annualFestivals: number;
  grassrootsDriven: string | null;
}

