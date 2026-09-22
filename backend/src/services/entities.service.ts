import mongoose from 'mongoose';
import Activity, { IActivityDocument } from '../models/Activity.model';
import Achievement, { IAchievementDocument } from '../models/Achievement.model';
import SiteContent, { ISiteContentDocument } from '../models/SiteContent.model';
import SiteSettings, { ISiteSettingsDocument } from '../models/SiteSettings.model';
import ContactMessage, { IContactMessageDocument } from '../models/ContactMessage.model';
import Event from '../models/Event.model';
import EventRegistration from '../models/EventRegistration.model';
import Member from '../models/Member.model';
import { buildPaginationMeta } from '../utils/apiResponse';
import { NotFoundError, AppError } from '../middleware/errorHandler';
import { generateMemberId, generateAdminId } from './idGenerator.service';
import type {
  CreateActivityInput, UpdateActivityInput, ActivityFilterParams,
  CreateAchievementInput, UpdateAchievementInput,
  UpsertSiteContentInput, UpdateSiteSettingsInput,
  CreateContactInput,
} from '../validators/entities.validator';
import { paginationSchema } from '../validators/user.validator';
import type { PaginationParams } from '../validators/user.validator';

// ─── Activity Service ─────────────────────────────────────────────────────
export async function listActivities(params: ActivityFilterParams) {
  const { page, limit, sortBy, sortOrder, search, category, published } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IActivityDocument> = {};
  if (category) filter['category'] = category;
  if (typeof published === 'boolean') filter['published'] = published;
  if (search) filter['$or'] = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  const sort: Record<string, 1 | -1> = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : { date: -1 };
  const [data, total] = await Promise.all([
    Activity.find(filter).populate('createdBy', 'fullName avatar').sort(sort).skip(skip).limit(limit).lean(),
    Activity.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getActivityById(id: string): Promise<IActivityDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Activity');
  const item = await Activity.findById(id).populate('createdBy', 'fullName avatar');
  if (!item) throw new NotFoundError('Activity');
  return item;
}

export async function getActivityBySlug(slug: string): Promise<IActivityDocument> {
  const item = await Activity.findOne({ slug }).populate('createdBy', 'fullName avatar');
  if (!item) throw new NotFoundError('Activity');
  return item;
}

export async function createActivity(data: CreateActivityInput, userId: mongoose.Types.ObjectId | string): Promise<IActivityDocument> {
  const item = new Activity({ ...data, date: new Date(data.date), createdBy: userId });
  await item.save();
  return item;
}

export async function updateActivity(id: string, data: UpdateActivityInput): Promise<IActivityDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Activity');
  const item = await Activity.findById(id);
  if (!item) throw new NotFoundError('Activity');
  Object.assign(item, data);
  if (data.date) item.date = new Date(data.date);
  await item.save();
  return item;
}

export async function deleteActivity(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Activity');
  const result = await Activity.findByIdAndDelete(id);
  if (!result) throw new NotFoundError('Activity');
}

// ─── Achievement Service ──────────────────────────────────────────────────
export async function listAchievements(params: PaginationParams & { published?: boolean }) {
  const { page = 1, limit = 20, sortBy, sortOrder, search, published } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IAchievementDocument> = {};
  if (typeof published === 'boolean') filter['published'] = published;
  if (search) filter['$or'] = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  const sort: Record<string, 1 | -1> = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : { date: -1 };
  const [data, total] = await Promise.all([
    Achievement.find(filter).populate('createdBy', 'fullName avatar').sort(sort).skip(skip).limit(limit).lean(),
    Achievement.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getAchievementById(id: string): Promise<IAchievementDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Achievement');
  const item = await Achievement.findById(id).populate('createdBy', 'fullName avatar');
  if (!item) throw new NotFoundError('Achievement');
  return item;
}

export async function createAchievement(data: CreateAchievementInput, userId: mongoose.Types.ObjectId | string): Promise<IAchievementDocument> {
  const item = new Achievement({ ...data, date: new Date(data.date), createdBy: userId });
  await item.save();
  return item;
}

export async function updateAchievement(id: string, data: UpdateAchievementInput): Promise<IAchievementDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Achievement');
  const item = await Achievement.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!item) throw new NotFoundError('Achievement');
  return item;
}

export async function deleteAchievement(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Achievement');
  const result = await Achievement.findByIdAndDelete(id);
  if (!result) throw new NotFoundError('Achievement');
}

// ─── SiteContent Service ──────────────────────────────────────────────────
export async function getAllSiteContent(): Promise<ISiteContentDocument[]> {
  return SiteContent.find().lean() as unknown as ISiteContentDocument[];
}

export async function getSiteContentBySection(sectionKey: string): Promise<ISiteContentDocument | null> {
  return SiteContent.findOne({ sectionKey }).lean() as unknown as ISiteContentDocument | null;
}

export async function upsertSiteContent(data: UpsertSiteContentInput): Promise<ISiteContentDocument> {
  const result = await SiteContent.findOneAndUpdate(
    { sectionKey: data.sectionKey },
    { $set: { contentPayload: data.contentPayload } },
    { new: true, upsert: true, runValidators: true }
  );
  if (!result) throw new Error('Failed to upsert site content');
  return result;
}

// ─── SiteSettings Service ─────────────────────────────────────────────────
export async function getSiteSettings(): Promise<ISiteSettingsDocument> {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({
      orgName: 'High School Youth Club',
      contactEmail: 'hsyc172@gmail.com',
      contactPhone: '+977 9748886690',
      address: 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal',
      socialLinks: {
        facebook: 'https://facebook.com/highschoolyouthclub',
        instagram: 'https://instagram.com/highschoolyouthclub',
        whatsapp: '+977 9748886690',
      },
      portalConfig: {
        clubNepaliName: 'हाई स्कुल युवा क्लब',
        registrationNumber: 'HSYC-KP5-2080',
        establishedYear: 2020,
        officeHours: 'Sunday – Friday: 9:00 AM – 5:00 PM NPT',
        allowPublicRegistration: true,
      },
    });
  }
  return settings;
}

export async function updateSiteSettings(data: UpdateSiteSettingsInput): Promise<ISiteSettingsDocument> {
  const existing = await SiteSettings.findOne();
  if (existing) {
    if (data.socialLinks && existing.socialLinks) {
      data.socialLinks = {
        ...(existing.toObject().socialLinks || {}),
        ...data.socialLinks,
      };
    }
    if (data.portalConfig && existing.portalConfig) {
      data.portalConfig = {
        ...(existing.toObject().portalConfig || {}),
        ...data.portalConfig,
      };
    }
    Object.assign(existing, data);
    existing.markModified('portalConfig');
    existing.markModified('socialLinks');
    await existing.save();
    return existing;
  }
  // Create default settings if none exist
  const settings = new SiteSettings({
    orgName: data.orgName ?? 'High School Youth Club',
    contactEmail: data.contactEmail ?? 'hsyc172@gmail.com',
    contactPhone: data.contactPhone ?? '+977 9748886690',
    address: data.address ?? 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal',
    ...data,
  });
  await settings.save();
  return settings;
}

// ─── Contact Service ──────────────────────────────────────────────────────
export async function createContactMessage(data: CreateContactInput): Promise<IContactMessageDocument> {
  // Prevent duplicate submissions within the last 15 seconds
  const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
  const recentDuplicate = await ContactMessage.findOne({
    email: data.email.toLowerCase(),
    subject: data.subject,
    message: data.message,
    createdAt: { $gte: fifteenSecondsAgo },
  });

  if (recentDuplicate) {
    throw new AppError(
      'You recently submitted an identical message. Please wait a moment before sending another.',
      409,
      'DUPLICATE_SUBMISSION'
    );
  }

  const msg = new ContactMessage(data);
  await msg.save();
  return msg;
}

export async function listContactMessages(params: PaginationParams & { isRead?: boolean; isArchived?: boolean }) {
  const { page = 1, limit = 20, isRead, isArchived } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IContactMessageDocument> = {};
  if (typeof isRead === 'boolean') filter['isRead'] = isRead;
  if (typeof isArchived === 'boolean') filter['isArchived'] = isArchived;
  const [data, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ContactMessage.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function markContactMessageRead(id: string, isRead: boolean): Promise<IContactMessageDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Contact message');
  const msg = await ContactMessage.findByIdAndUpdate(id, { $set: { isRead } }, { new: true });
  if (!msg) throw new NotFoundError('Contact message');
  return msg;
}

export async function archiveContactMessage(id: string): Promise<IContactMessageDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Contact message');
  const msg = await ContactMessage.findByIdAndUpdate(id, { $set: { isArchived: true } }, { new: true });
  if (!msg) throw new NotFoundError('Contact message');
  return msg;
}

export async function deleteContactMessage(id: string): Promise<IContactMessageDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Contact message');
  const msg = await ContactMessage.findByIdAndDelete(id);
  if (!msg) throw new NotFoundError('Contact message');
  return msg;
}

// ─── UserProfile Service ──────────────────────────────────────────────────
import UserProfile, { IUserProfileDocument } from '../models/UserProfile.model';
import type { CreateUserProfileInput, UpdateUserProfileInput, UpdateUserRoleInput } from '../validators/user.validator';

export async function listUserProfiles(params: PaginationParams & { role?: string; status?: string }) {
  const parsed = paginationSchema.parse(params);
  const { page, limit, search } = parsed;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IUserProfileDocument> = {};
  if (params.role) filter['role'] = params.role;
  if (params.status) filter['status'] = params.status;
  if (search) filter['$or'] = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const [data, total] = await Promise.all([
    UserProfile.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserProfile.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getUserProfileBySub(supabaseUserId: string): Promise<IUserProfileDocument | null> {
  return UserProfile.findOne({ supabaseUserId });
}

export async function createUserProfile(data: CreateUserProfileInput): Promise<IUserProfileDocument> {
  const profileData: any = { ...data };
  if (!profileData.memberId && !profileData.adminId) {
    if (profileData.role === 'ADMIN' || profileData.role === 'SUPER_ADMIN') {
      const generatedAdminId = await generateAdminId();
      profileData.adminId = generatedAdminId;
      profileData.memberId = generatedAdminId;
    } else {
      profileData.memberId = await generateMemberId();
    }
  }
  const profile = new UserProfile(profileData);
  await profile.save();
  return profile;
}

export async function updateUserProfile(id: string, data: UpdateUserProfileInput): Promise<IUserProfileDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('User profile');
  // Strip any restricted/privileged fields if inadvertently passed
  const {
    role: _role,
    status: _status,
    memberId: _memberId,
    adminId: _adminId,
    email: _email,
    supabaseUserId: _sub,
    volunteerHours: _vh,
    eventsAttended: _ea,
    youthLeaderRank: _ylr,
    projectsBacked: _pb,
    permissions: _perm,
    passwordHash: _ph,
    activeSessions: _as,
    ...allowedUpdates
  } = (data || {}) as any;

  const profile = await UserProfile.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true, runValidators: true });
  if (!profile) throw new NotFoundError('User profile');
  return profile;
}

export async function updateUserRole(id: string, data: UpdateUserRoleInput): Promise<IUserProfileDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('User profile');
  const profile = await UserProfile.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!profile) throw new NotFoundError('User profile');
  return profile;
}

export async function deleteUserProfile(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('User profile');
  const result = await UserProfile.findByIdAndDelete(id);
  if (!result) throw new NotFoundError('User profile');
}

export async function getUserProfileWithStats(id: string): Promise<IUserProfileDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('User profile');
  const profile = await UserProfile.findById(id);
  if (!profile) throw new NotFoundError('User profile');

  let needsSave = false;

  // Preserve existing IDs; generate unique ID securely if missing on existing accounts
  if (!profile.memberId && !profile.adminId) {
    if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN') {
      const generatedAdminId = await generateAdminId();
      profile.adminId = generatedAdminId;
      profile.memberId = generatedAdminId;
    } else {
      profile.memberId = await generateMemberId();
    }
    needsSave = true;
  } else if (!profile.memberId && profile.adminId) {
    profile.memberId = profile.adminId;
    needsSave = true;
  }

  // Real events registered/attended from EventRegistration
  const realEventCount = await EventRegistration.countDocuments({
    userId: profile._id,
    status: { $in: ['registered', 'attended'] },
  });

  // Real volunteer hours from recorded volunteer activities
  const realVolunteerHours = Array.isArray(profile.volunteerActivities) && profile.volunteerActivities.length > 0
    ? profile.volunteerActivities.reduce((acc, curr) => acc + (curr.hours || 0), 0)
    : (profile.volunteerHours || 0);

  // Real projects backed from backedProjects array
  const realProjectsBacked = Array.isArray(profile.backedProjects) && profile.backedProjects.length > 0
    ? profile.backedProjects.length
    : (profile.projectsBacked || 0);

  // Real rank calculated from membership achievements and volunteer hours
  let realRank = profile.youthLeaderRank || 'Unranked';
  const realAchievementCount = await Achievement.countDocuments({
    $or: [
      { createdBy: profile._id },
      { recipient: { $regex: new RegExp(`^${profile.email}$|^${profile.fullName}$`, 'i') } },
    ],
  });

  if (profile.role === 'SUPER_ADMIN' || profile.role === 'ADMIN') {
    realRank = 'Executive';
  } else if (realAchievementCount >= 3 || realVolunteerHours >= 25) {
    realRank = 'Tier 2';
  } else if (realAchievementCount >= 1 || realVolunteerHours >= 5) {
    realRank = 'Tier 1';
  } else if (!profile.youthLeaderRank || profile.youthLeaderRank === 'Tier 2') {
    realRank = 'Unranked';
  }

  // Update profile fields if changed
  if (profile.eventsAttended !== realEventCount) {
    profile.eventsAttended = realEventCount;
    needsSave = true;
  }
  if (profile.volunteerHours !== realVolunteerHours) {
    profile.volunteerHours = realVolunteerHours;
    needsSave = true;
  }
  if (profile.projectsBacked !== realProjectsBacked) {
    profile.projectsBacked = realProjectsBacked;
    needsSave = true;
  }
  if (profile.youthLeaderRank !== realRank) {
    profile.youthLeaderRank = realRank;
    needsSave = true;
  }

  if (needsSave) {
    await profile.save();
  }

  return profile;
}

export async function registerForEvent(
  eventId: string,
  attendeeData: { name: string; email: string; phone?: string; notes?: string },
  userId?: string
) {
  if (!mongoose.Types.ObjectId.isValid(eventId)) throw new NotFoundError('Event');
  const event = await Event.findById(eventId);
  if (!event) throw new NotFoundError('Event');

  const normalizedEmail = attendeeData.email.toLowerCase().trim();
  let registration;

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const userObjId = new mongoose.Types.ObjectId(userId);
    registration = await EventRegistration.findOneAndUpdate(
      { eventId: event._id, userId: userObjId },
      {
        $set: {
          name: attendeeData.name,
          email: normalizedEmail,
          phone: attendeeData.phone || '',
          notes: attendeeData.notes || '',
          status: 'registered',
          registeredAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update member's attendedEvents array and eventsAttended count
    const user = await UserProfile.findById(userId);
    if (user) {
      if (!user.attendedEvents) user.attendedEvents = [];
      if (!user.attendedEvents.some((e) => e.toString() === event._id.toString())) {
        user.attendedEvents.push(event._id);
      }
      const count = await EventRegistration.countDocuments({
        userId: user._id,
        status: { $in: ['registered', 'attended'] },
      });
      user.eventsAttended = count;
      await user.save();
    }
  } else {
    registration = await EventRegistration.findOneAndUpdate(
      { eventId: event._id, email: normalizedEmail },
      {
        $set: {
          name: attendeeData.name,
          email: normalizedEmail,
          phone: attendeeData.phone || '',
          notes: attendeeData.notes || '',
          status: 'registered',
          registeredAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return registration;
}

export async function getUserRegisteredEvents(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const registrations = await EventRegistration.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: ['registered', 'attended'] },
  })
    .sort({ registeredAt: -1 })
    .populate('eventId')
    .lean();

  return registrations
    .map((reg) => reg.eventId)
    .filter((ev) => ev != null);
}

export async function recordVolunteerHours(
  userId: string,
  data: { title: string; hours: number; description?: string; date?: Date }
) {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new NotFoundError('User profile');
  const profile = await UserProfile.findById(userId);
  if (!profile) throw new NotFoundError('User profile');

  if (!profile.volunteerActivities) profile.volunteerActivities = [];
  profile.volunteerActivities.push({
    title: data.title,
    hours: data.hours,
    description: data.description,
    date: data.date || new Date(),
  });

  profile.volunteerHours = profile.volunteerActivities.reduce((acc, curr) => acc + curr.hours, 0);

  if (profile.volunteerHours >= 25 && profile.youthLeaderRank === 'Tier 1') {
    profile.youthLeaderRank = 'Tier 2';
  } else if (profile.volunteerHours >= 5 && profile.youthLeaderRank === 'Unranked') {
    profile.youthLeaderRank = 'Tier 1';
  }

  await profile.save();
  return profile;
}

export async function recordProjectParticipation(userId: string, projectId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new NotFoundError('User profile');
  const profile = await UserProfile.findById(userId);
  if (!profile) throw new NotFoundError('User profile');

  if (!profile.backedProjects) profile.backedProjects = [];
  const projObjId = new mongoose.Types.ObjectId(projectId);
  if (!profile.backedProjects.some((p) => p.toString() === projectId)) {
    profile.backedProjects.push(projObjId);
  }
  profile.projectsBacked = profile.backedProjects.length;
  await profile.save();
  return profile;
}


// ─── AuditLog Service ─────────────────────────────────────────────────────
import AuditLog, { IAuditLogDocument } from '../models/AuditLog.model';

export async function listAuditLogs(params: PaginationParams & { userId?: string; resource?: string }) {
  const { page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IAuditLogDocument> = {};
  if (params.userId && mongoose.Types.ObjectId.isValid(params.userId)) filter['userId'] = new mongoose.Types.ObjectId(params.userId);
  if (params.resource) filter['resource'] = params.resource;
  const [data, total] = await Promise.all([
    AuditLog.find(filter).populate('userId', 'fullName email').sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

// ─── Public Dynamic Statistics Service ────────────────────────────────────
export async function getPublicStats() {
  const [
    activeMembersCount,
    memberEmails,
    publishedActivitiesCount,
    completedEventsCount,
    festivalEventsCount,
    totalPublishedEvents,
  ] = await Promise.all([
    Member.countDocuments({ status: 'active' }),
    Member.distinct('email', {
      status: 'active',
      email: { $exists: true, $ne: '' },
    }),
    Activity.countDocuments({ published: true }),
    Event.countDocuments({ status: 'completed' }),
    Event.countDocuments({
      published: true,
      $or: [
        { eventType: { $in: ['cultural', 'celebration'] } },
        { title: { $regex: /festival|celebration|utsav|mela|parva|उत्सव|महोत्सव|मेला|पर्व/i } },
      ],
    }),
    Event.countDocuments({ published: true }),
  ]);

  const activeUserVolunteersCount = await UserProfile.countDocuments({
    status: 'active',
    role: { $in: ['VOLUNTEER', 'MEMBER'] },
    ...(memberEmails.length > 0 ? { email: { $nin: memberEmails } } : {}),
  });

  const activeVolunteers = activeMembersCount + activeUserVolunteersCount;
  const projectsExecuted = publishedActivitiesCount + completedEventsCount;
  const annualFestivals = festivalEventsCount;

  const totalInitiatives = publishedActivitiesCount + totalPublishedEvents;
  let grassrootsDriven: string | null = null;

  if (totalInitiatives > 0) {
    const [grassrootsActivities, grassrootsEvents] = await Promise.all([
      Activity.countDocuments({
        published: true,
        $or: [
          { category: { $in: ['environment', 'education', 'health', 'culture', 'sports', 'social_work'] } },
          { organizer: { $regex: /youth|club|community|local|ward|swayamsevak|स्वयंसेवक|समुदाय/i } },
        ],
      }),
      Event.countDocuments({
        published: true,
        $or: [
          { eventType: { $in: ['community_service', 'cultural', 'sports', 'educational', 'celebration'] } },
          { organizer: { $regex: /youth|club|community|local|ward|swayamsevak|स्वयंसेवक|समुदाय/i } },
        ],
      }),
    ]);

    const grassrootsTotal = grassrootsActivities + grassrootsEvents;
    const percentage = Math.round((grassrootsTotal / totalInitiatives) * 100);
    grassrootsDriven = `${Math.min(100, Math.max(0, percentage))}%`;
  }

  return {
    activeVolunteers,
    projectsExecuted,
    annualFestivals,
    grassrootsDriven,
  };
}

