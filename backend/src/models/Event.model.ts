import mongoose, { Document, Model, Schema } from 'mongoose';
import slugify from 'slugify';

// ─── TypeScript Interface ──────────────────────────────────────────────────
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

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  eventType: EventType;
  date: Date;
  startTime?: string;
  endTime?: string;
  location: string;
  ward?: string;
  organizer: string;
  coverImage?: string;
  galleryImages: string[];
  status: EventStatus;
  registrationEnabled: boolean;
  registrationDeadline?: Date;
  published: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventDocument extends IEvent, Document {}
export interface IEventModel extends Model<IEventDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
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
      required: [true, 'Event description is required'],
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    eventType: {
      type: String,
      enum: ['cultural', 'sports', 'educational', 'community_service', 'fundraising', 'meeting', 'celebration', 'other'] as const,
      required: [true, 'Event type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    ward: { type: String, trim: true },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    coverImage: { type: String, trim: true },
    galleryImages: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed', 'archived'] as const,
      default: 'draft',
      index: true,
    },
    registrationEnabled: { type: Boolean, default: false },
    registrationDeadline: { type: Date },
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

// ─── Pre-save: Auto-generate slug from title ──────────────────────────────
eventSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    if (!baseSlug) {
      baseSlug = `event-${Date.now().toString(36)}`;
    }
    let slug = baseSlug;
    let count = 0;

    // Ensure uniqueness
    while (await (this.constructor as IEventModel).findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────
eventSchema.index({ date: -1 });
eventSchema.index({ status: 1, published: 1 });
eventSchema.index({ eventType: 1, date: -1 });
eventSchema.index({ createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const Event: IEventModel =
  (mongoose.models['Event'] as IEventModel) ||
  mongoose.model<IEventDocument, IEventModel>('Event', eventSchema);

export default Event;
