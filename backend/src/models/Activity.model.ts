import mongoose, { Document, Model, Schema } from 'mongoose';
import slugify from 'slugify';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type ActivityCategory =
  | 'environment'
  | 'education'
  | 'health'
  | 'culture'
  | 'sports'
  | 'social_work'
  | 'other';

export type ActivityStatus = 'draft' | 'published' | 'archived';

export interface IActivity {
  title: string;
  slug: string;
  description: string;
  category: ActivityCategory;
  coverImage?: string;
  status: ActivityStatus;
  date: Date;
  location?: string;
  organizer?: string;
  published: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityDocument extends IActivity, Document {}
export interface IActivityModel extends Model<IActivityDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const activitySchema = new Schema<IActivityDocument>(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    category: {
      type: String,
      enum: ['environment', 'education', 'health', 'culture', 'sports', 'social_work', 'other'] as const,
      required: [true, 'Category is required'],
    },
    coverImage: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'] as const,
      default: 'draft',
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required'],
      index: true,
    },
    location: { type: String, trim: true },
    organizer: { type: String, trim: true },
    published: { type: Boolean, default: false, index: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: [true, 'Creator reference is required'],
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

// ─── Pre-save: Auto-generate slug ─────────────────────────────────────────
activitySchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    if (!baseSlug) {
      baseSlug = `activity-${Date.now().toString(36)}`;
    }
    let slug = baseSlug;
    let count = 0;
    while (await (this.constructor as IActivityModel).findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────
activitySchema.index({ date: -1, published: 1 });
activitySchema.index({ category: 1, date: -1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const Activity: IActivityModel =
  (mongoose.models['Activity'] as IActivityModel) ||
  mongoose.model<IActivityDocument, IActivityModel>('Activity', activitySchema);

export default Activity;
