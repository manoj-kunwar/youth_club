import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse';
import * as entitiesService from '../services/entities.service';
import * as memberService from '../services/member.service';
import {
  createActivitySchema, updateActivitySchema, activityFilterSchema,
  createAchievementSchema, updateAchievementSchema,
  createMemberSchema, updateMemberSchema, memberFilterSchema,
  upsertSiteContentSchema, updateSiteSettingsSchema,
  createContactSchema,
} from '../validators/entities.validator';
import { paginationSchema } from '../validators/user.validator';
import { recordAction, AuditActions } from '../services/auditLog.service';
import { sendContactNotification } from '../services/email.service';
import { config } from '../config/env';

// ─── Activity Controllers ─────────────────────────────────────────────────
export const getActivities = asyncHandler(async (req: Request, res: Response) => {
  const params = activityFilterSchema.parse({ ...req.query });
  const { data, pagination } = await entitiesService.listActivities(params);
  sendPaginated(res, data, pagination);
});

export const getActivityById = asyncHandler(async (req: Request, res: Response) => {
  const item = await entitiesService.getActivityById(String(req.params['id']));
  sendSuccess(res, item);
});

export const getActivityBySlug = asyncHandler(async (req: Request, res: Response) => {
  const item = await entitiesService.getActivityBySlug(String(req.params['slug']));
  sendSuccess(res, item);
});

export const createActivity = asyncHandler(async (req: Request, res: Response) => {
  const data = createActivitySchema.parse(req.body);
  const item = await entitiesService.createActivity(data, req.user!.profile._id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.ACTIVITY_CREATED, resource: 'Activity', resourceId: item._id.toString(), req });
  sendCreated(res, item, 'Activity created');
});

export const updateActivity = asyncHandler(async (req: Request, res: Response) => {
  const data = updateActivitySchema.parse(req.body);
  const item = await entitiesService.updateActivity(String(req.params['id']), data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.ACTIVITY_UPDATED, resource: 'Activity', resourceId: item._id.toString(), req });
  sendSuccess(res, item, 'Activity updated');
});

export const deleteActivity = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  await entitiesService.deleteActivity(id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.ACTIVITY_DELETED, resource: 'Activity', resourceId: id, req });
  sendSuccess(res, null, 'Activity deleted');
});

// ─── Achievement Controllers ──────────────────────────────────────────────
export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  const params = paginationSchema.parse({ ...req.query });
  const published = req.query['published'] === 'true' ? true : req.query['published'] === 'false' ? false : undefined;
  const { data, pagination } = await entitiesService.listAchievements({ ...params, published });
  sendPaginated(res, data, pagination);
});

export const getAchievementById = asyncHandler(async (req: Request, res: Response) => {
  const item = await entitiesService.getAchievementById(String(req.params['id']));
  sendSuccess(res, item);
});

export const createAchievement = asyncHandler(async (req: Request, res: Response) => {
  const data = createAchievementSchema.parse(req.body);
  const item = await entitiesService.createAchievement(data, req.user!.profile._id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.ACHIEVEMENT_CREATED, resource: 'Achievement', resourceId: item._id.toString(), req });
  sendCreated(res, item, 'Achievement created');
});

export const updateAchievement = asyncHandler(async (req: Request, res: Response) => {
  const data = updateAchievementSchema.parse(req.body);
  const item = await entitiesService.updateAchievement(String(req.params['id']), data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.ACHIEVEMENT_UPDATED, resource: 'Achievement', resourceId: item._id.toString(), req });
  sendSuccess(res, item, 'Achievement updated');
});

export const deleteAchievement = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  await entitiesService.deleteAchievement(id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.ACHIEVEMENT_DELETED, resource: 'Achievement', resourceId: id, req });
  sendSuccess(res, null, 'Achievement deleted');
});

// ─── Member Controllers ───────────────────────────────────────────────────
export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const params = memberFilterSchema.parse({ ...req.query });
  const { data, pagination } = await memberService.listMembers(params);
  sendPaginated(res, data, pagination);
});

export const getMemberById = asyncHandler(async (req: Request, res: Response) => {
  const item = await memberService.getMemberById(String(req.params['id']));
  sendSuccess(res, item);
});

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const data = createMemberSchema.parse(req.body);
  const item = await memberService.createMember(data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.MEMBER_CREATED, resource: 'Member', resourceId: item._id.toString(), req });
  sendCreated(res, item, 'Member added');
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const data = updateMemberSchema.parse(req.body);
  const item = await memberService.updateMember(String(req.params['id']), data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.MEMBER_UPDATED, resource: 'Member', resourceId: item._id.toString(), req });
  sendSuccess(res, item, 'Member updated');
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  await memberService.deleteMember(id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.MEMBER_DELETED, resource: 'Member', resourceId: id, req });
  sendSuccess(res, null, 'Member removed');
});

// ─── SiteContent Controllers ──────────────────────────────────────────────
export const getAllSiteContent = asyncHandler(async (req: Request, res: Response) => {
  const data = await entitiesService.getAllSiteContent();
  sendSuccess(res, data);
});

export const getSiteContentSection = asyncHandler(async (req: Request, res: Response) => {
  const data = await entitiesService.getSiteContentBySection(String(req.params['section']));
  sendSuccess(res, data);
});

export const upsertSiteContent = asyncHandler(async (req: Request, res: Response) => {
  const body = { ...req.body };
  if (!body.sectionKey && req.params['section']) {
    body.sectionKey = req.params['section'];
  }
  const data = upsertSiteContentSchema.parse(body);
  const result = await entitiesService.upsertSiteContent(data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.SITE_CONTENT_UPDATED, resource: 'SiteContent', resourceId: data.sectionKey, req });
  sendSuccess(res, result, 'Site content updated');
});

export const getPublicStats = asyncHandler(async (req: Request, res: Response) => {
  const data = await entitiesService.getPublicStats();
  sendSuccess(res, data);
});

// ─── SiteSettings Controllers ─────────────────────────────────────────────
export const getSiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const data = await entitiesService.getSiteSettings();
  sendSuccess(res, data);
});

export const updateSiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const data = updateSiteSettingsSchema.parse(req.body);
  const result = await entitiesService.updateSiteSettings(data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.SITE_SETTINGS_UPDATED, resource: 'SiteSettings', req });
  sendSuccess(res, result, 'Site settings updated');
});

// ─── Contact Controllers ──────────────────────────────────────────────────
export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const data = createContactSchema.parse(req.body);
  const msg = await entitiesService.createContactMessage(data);

  // Fire notification email to configured organization contactEmail or super admin (non-blocking)
  (async () => {
    try {
      const settings = await entitiesService.getSiteSettings();
      const targetEmail = settings?.contactEmail || config.SUPER_ADMIN_EMAIL;
      if (targetEmail) {
        await sendContactNotification(targetEmail, data);
      }
    } catch {
      // Non-blocking notification failure logged by email service
    }
  })();

  sendCreated(res, { id: msg._id }, 'Your message has been received. We will get back to you soon!');
});

export const getContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const params = paginationSchema.parse({ ...req.query });
  const isRead = req.query['isRead'] === 'true' ? true : req.query['isRead'] === 'false' ? false : undefined;
  const isArchived = req.query['isArchived'] === 'true' ? true : req.query['isArchived'] === 'false' ? false : undefined;
  const { data, pagination } = await entitiesService.listContactMessages({ ...params, isRead, isArchived });
  sendPaginated(res, data, pagination);
});

export const markContactRead = asyncHandler(async (req: Request, res: Response) => {
  const { isRead } = req.body as { isRead: boolean };
  const msg = await entitiesService.markContactMessageRead(String(req.params['id']), isRead);
  sendSuccess(res, msg, `Message marked as ${isRead ? 'read' : 'unread'}`);
});

export const archiveContact = asyncHandler(async (req: Request, res: Response) => {
  const msg = await entitiesService.archiveContactMessage(String(req.params['id']));
  sendSuccess(res, msg, 'Message archived');
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  const msg = await entitiesService.deleteContactMessage(id);
  await recordAction({
    userId: req.user!.profile._id,
    action: AuditActions.CONTACT_DELETED,
    resource: 'ContactMessage',
    resourceId: id,
    metadata: {
      senderName: msg.name,
      senderEmail: msg.email,
      subject: msg.subject,
    },
    req,
  });
  sendSuccess(res, null, 'Contact inquiry deleted successfully');
});

// ─── AuditLog Controllers ─────────────────────────────────────────────────
export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const params = paginationSchema.parse({ ...req.query });
  const { userId, resource } = req.query as { userId?: string; resource?: string };
  const { data, pagination } = await entitiesService.listAuditLogs({ ...params, userId, resource });
  sendPaginated(res, data, pagination);
});
