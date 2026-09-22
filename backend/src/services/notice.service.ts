import mongoose from 'mongoose';
import Notice, { INoticeDocument } from '../models/Notice.model';
import { buildPaginationMeta } from '../utils/apiResponse';
import { NotFoundError, ConflictError } from '../middleware/errorHandler';
import type { CreateNoticeInput, UpdateNoticeInput, NoticeFilterParams } from '../validators/entities.validator';

export async function listNotices(params: NoticeFilterParams) {
  const { page, limit, sortBy, sortOrder, search, category, priority, published, pinned } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<INoticeDocument> = {};

  if (category) filter['category'] = category;
  if (priority) filter['priority'] = priority;
  if (typeof published === 'boolean') filter['published'] = published;
  if (typeof pinned === 'boolean') filter['pinned'] = pinned;
  if (search) {
    filter['$or'] = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  // Auto-exclude expired notices for public queries
  const sort: Record<string, 1 | -1> = sortBy
    ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    : { pinned: -1, publishedAt: -1 };

  const [data, total] = await Promise.all([
    Notice.find(filter)
      .populate('author', 'fullName avatar')
      .sort(sort).skip(skip).limit(limit).lean(),
    Notice.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getNoticeById(id: string): Promise<INoticeDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Notice');
  const notice = await Notice.findById(id).populate('author', 'fullName avatar');
  if (!notice) throw new NotFoundError('Notice');
  return notice;
}

export async function getNoticeBySlug(slug: string): Promise<INoticeDocument> {
  const notice = await Notice.findOne({ slug }).populate('author', 'fullName avatar');
  if (!notice) throw new NotFoundError('Notice');
  return notice;
}

export async function createNotice(
  data: CreateNoticeInput,
  userId: mongoose.Types.ObjectId | string
): Promise<INoticeDocument> {
  const notice = new Notice({ ...data, author: userId });
  try {
    await notice.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) throw new ConflictError('A notice with this title already exists');
    throw err;
  }
  return notice;
}

export async function updateNotice(id: string, data: UpdateNoticeInput): Promise<INoticeDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Notice');
  const notice = await Notice.findById(id);
  if (!notice) throw new NotFoundError('Notice');
  Object.assign(notice, data);
  try {
    await notice.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) throw new ConflictError('A notice with this title already exists');
    throw err;
  }
  return notice;
}

export async function deleteNotice(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Notice');
  const result = await Notice.findByIdAndDelete(id);
  if (!result) throw new NotFoundError('Notice');
}

export async function pinNotice(id: string, pinned: boolean): Promise<INoticeDocument> {
  return updateNotice(id, { pinned });
}

export async function publishNotice(id: string, published: boolean): Promise<INoticeDocument> {
  return updateNotice(id, { published });
}
