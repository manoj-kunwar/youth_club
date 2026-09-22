import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse';
import * as noticeService from '../services/notice.service';
import * as galleryService from '../services/gallery.service';
import {
  createNoticeSchema, updateNoticeSchema, noticeFilterSchema,
  createGallerySchema, updateGallerySchema, galleryFilterSchema,
} from '../validators/entities.validator';
import { recordAction, AuditActions } from '../services/auditLog.service';

// ─── Notice Controllers ───────────────────────────────────────────────────
export const getNotices = asyncHandler(async (req: Request, res: Response) => {
  const params = noticeFilterSchema.parse({ ...req.query });
  const { data, pagination } = await noticeService.listNotices(params);
  sendPaginated(res, data, pagination);
});

export const getNoticeById = asyncHandler(async (req: Request, res: Response) => {
  const notice = await noticeService.getNoticeById(String(req.params['id']));
  sendSuccess(res, notice);
});

export const getNoticeBySlug = asyncHandler(async (req: Request, res: Response) => {
  const notice = await noticeService.getNoticeBySlug(String(req.params['slug']));
  sendSuccess(res, notice);
});

export const createNotice = asyncHandler(async (req: Request, res: Response) => {
  const data = createNoticeSchema.parse(req.body);
  const userId = req.user!.profile._id;
  const notice = await noticeService.createNotice(data, userId);
  await recordAction({ userId, action: AuditActions.NOTICE_CREATED, resource: 'Notice', resourceId: notice._id.toString(), metadata: { title: notice.title }, req });
  sendCreated(res, notice, 'Notice created successfully');
});

export const updateNotice = asyncHandler(async (req: Request, res: Response) => {
  const data = updateNoticeSchema.parse(req.body);
  const notice = await noticeService.updateNotice(String(req.params['id']), data);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.NOTICE_UPDATED, resource: 'Notice', resourceId: notice._id.toString(), req });
  sendSuccess(res, notice, 'Notice updated successfully');
});

export const publishNotice = asyncHandler(async (req: Request, res: Response) => {
  const { published } = req.body as { published: boolean };
  const notice = await noticeService.publishNotice(String(req.params['id']), published);
  await recordAction({ userId: req.user!.profile._id, action: published ? AuditActions.NOTICE_PUBLISHED : AuditActions.NOTICE_UPDATED, resource: 'Notice', resourceId: notice._id.toString(), req });
  sendSuccess(res, notice, `Notice ${published ? 'published' : 'unpublished'}`);
});

export const pinNotice = asyncHandler(async (req: Request, res: Response) => {
  const { pinned } = req.body as { pinned: boolean };
  const notice = await noticeService.pinNotice(String(req.params['id']), pinned);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.NOTICE_PINNED, resource: 'Notice', resourceId: notice._id.toString(), req });
  sendSuccess(res, notice, `Notice ${pinned ? 'pinned' : 'unpinned'}`);
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  await noticeService.deleteNotice(id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.NOTICE_DELETED, resource: 'Notice', resourceId: id, req });
  sendSuccess(res, null, 'Notice deleted successfully');
});

// ─── Gallery Controllers ──────────────────────────────────────────────────
export const getGallery = asyncHandler(async (req: Request, res: Response) => {
  const params = galleryFilterSchema.parse({ ...req.query });
  const { data, pagination } = await galleryService.listGallery(params);
  sendPaginated(res, data, pagination);
});

export const getGalleryItemById = asyncHandler(async (req: Request, res: Response) => {
  const item = await galleryService.getGalleryById(String(req.params['id']));
  sendSuccess(res, item);
});

export const createGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const data = createGallerySchema.parse(req.body);
  const userId = req.user!.profile._id;
  const item = await galleryService.createGalleryItem(data, userId);
  await recordAction({ userId, action: AuditActions.GALLERY_UPLOADED, resource: 'Gallery', resourceId: item._id.toString(), metadata: { title: item.title }, req });
  sendCreated(res, item, 'Gallery item created successfully');
});

export const updateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const data = updateGallerySchema.parse(req.body);
  const item = await galleryService.updateGalleryItem(String(req.params['id']), data);
  sendSuccess(res, item, 'Gallery item updated');
});

export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params['id']);
  await galleryService.deleteGalleryItem(id);
  await recordAction({ userId: req.user!.profile._id, action: AuditActions.GALLERY_DELETED, resource: 'Gallery', resourceId: id, req });
  sendSuccess(res, null, 'Gallery item deleted');
});
