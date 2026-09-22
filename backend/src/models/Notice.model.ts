import mongoose, { Document, Model, Schema } from 'mongoose';
import slugify from 'slugify';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoticeCategory =
  | 'general'
  | 'event'
  | 'urgent'
  | 'recruitment'
  | 'financial'
  | 'administrative'
  | 'other';

export interface INotice {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishedAt?: Date;
  expiryDate?: Date;
  attachmentUrl?: string;
  author: mongoose.Types.ObjectId;
  published: boolean;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INoticeDocument extends INotice, Document {}
export interface INoticeModel extends Model<INoticeDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const noticeSchema = new Schema<INoticeDocument>(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      maxlength: [50000, 'Content cannot exceed 50000 characters'],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['general', 'event', 'urgent', 'recruitment', 'financial', 'administrative', 'other'] as const,
      default: 'general',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'] as const,
      default: 'medium',
      required: true,
    },
    publishedAt: { type: Date, index: true },
    expiryDate: { type: Date, index: true },
    attachmentUrl: { type: String, trim: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: [true, 'Author reference is required'],
    },
    published: { type: Boolean, default: false, index: true },
    pinned: { type: Boolean, default: false, index: true },
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

// ─── Pre-save: Auto-generate slug ─────────────────────────────────────────
noticeSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    if (!baseSlug) {
      baseSlug = `notice-${Date.now().toString(36)}`;
    }
    let slug = baseSlug;
    let count = 0;
    while (await (this.constructor as INoticeModel).findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  // Auto-set publishedAt when publishing
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────
noticeSchema.index({ published: 1, pinned: -1, publishedAt: -1 });
noticeSchema.index({ category: 1, priority: 1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const Notice: INoticeModel =
  (mongoose.models['Notice'] as INoticeModel) ||
  mongoose.model<INoticeDocument, INoticeModel>('Notice', noticeSchema);

export default Notice;
