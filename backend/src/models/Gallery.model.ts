import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type GalleryFeatureType = 'photo' | 'video' | 'document';

export interface IGallery {
  title: string;
  description?: string;
  featureType: GalleryFeatureType;
  mediaUrl: string;
  cloudinaryPublicId: string;
  thumbnailUrl?: string;
  folder?: string;
  eventId?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryDocument extends IGallery, Document {}
export interface IGalleryModel extends Model<IGalleryDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const gallerySchema = new Schema<IGalleryDocument>(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    featureType: {
      type: String,
      enum: ['photo', 'video', 'document'] as const,
      default: 'photo',
      required: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      trim: true,
      unique: true,
    },
    thumbnailUrl: { type: String, trim: true },
    folder: { type: String, trim: true, index: true },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: [true, 'Uploader reference is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => { const r = ret as Record<string, unknown>; delete r["__v"]; return ret; },
    },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
gallerySchema.index({ eventId: 1, createdAt: -1 });
gallerySchema.index({ folder: 1, featureType: 1 });
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ uploadedBy: 1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const Gallery: IGalleryModel =
  (mongoose.models['Gallery'] as IGalleryModel) ||
  mongoose.model<IGalleryDocument, IGalleryModel>('Gallery', gallerySchema);

export default Gallery;
