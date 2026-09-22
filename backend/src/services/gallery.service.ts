import mongoose from 'mongoose';
import Gallery, { IGalleryDocument } from '../models/Gallery.model';
import { buildPaginationMeta } from '../utils/apiResponse';
import { NotFoundError } from '../middleware/errorHandler';
import { deleteCloudinaryAsset } from './cloudinary.service';
import type { CreateGalleryInput, UpdateGalleryInput, GalleryFilterParams } from '../validators/entities.validator';

export async function listGallery(params: GalleryFilterParams) {
  const { page, limit, sortBy, sortOrder, search, featureType, folder, eventId } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IGalleryDocument> = {};

  if (featureType) filter['featureType'] = featureType;
  if (folder) filter['folder'] = folder;
  if (eventId && mongoose.Types.ObjectId.isValid(eventId)) filter['eventId'] = new mongoose.Types.ObjectId(eventId);
  if (search) {
    filter['$or'] = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = sortBy
    ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    : { createdAt: -1 };

  const [data, total] = await Promise.all([
    Gallery.find(filter)
      .populate('uploadedBy', 'fullName avatar')
      .populate('eventId', 'title slug')
      .sort(sort).skip(skip).limit(limit).lean(),
    Gallery.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getGalleryById(id: string): Promise<IGalleryDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Gallery item');
  const item = await Gallery.findById(id).populate('uploadedBy', 'fullName avatar').populate('eventId', 'title slug');
  if (!item) throw new NotFoundError('Gallery item');
  return item;
}

export async function createGalleryItem(
  data: CreateGalleryInput,
  userId: mongoose.Types.ObjectId | string
): Promise<IGalleryDocument> {
  const item = new Gallery({
    ...data,
    eventId: data.eventId ? new mongoose.Types.ObjectId(data.eventId) : undefined,
    uploadedBy: userId,
  });
  await item.save();
  return item;
}

export async function updateGalleryItem(id: string, data: UpdateGalleryInput): Promise<IGalleryDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Gallery item');
  const item = await Gallery.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!item) throw new NotFoundError('Gallery item');
  return item;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Gallery item');
  const item = await Gallery.findById(id);
  if (!item) throw new NotFoundError('Gallery item');

  // Delete from Cloudinary first
  await deleteCloudinaryAsset(item.cloudinaryPublicId);

  await item.deleteOne();
}
