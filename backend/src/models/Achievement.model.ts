import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type AchievementCategory =
  | 'award'
  | 'recognition'
  | 'milestone'
  | 'partnership'
  | 'project'
  | 'other';

export interface IAchievement {
  title: string;
  description: string;
  date: Date;
  category: AchievementCategory;
  image?: string;
  recipient?: string;
  organization?: string;
  published: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAchievementDocument extends IAchievement, Document {}
export interface IAchievementModel extends Model<IAchievementDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const achievementSchema = new Schema<IAchievementDocument>(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Achievement date is required'],
      index: true,
    },
    category: {
      type: String,
      enum: ['award', 'recognition', 'milestone', 'partnership', 'project', 'other'] as const,
      required: [true, 'Category is required'],
    },
    image: { type: String, trim: true },
    recipient: { type: String, trim: true },
    organization: { type: String, trim: true },
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

// ─── Indexes ──────────────────────────────────────────────────────────────
achievementSchema.index({ date: -1, published: 1 });
achievementSchema.index({ category: 1, date: -1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const Achievement: IAchievementModel =
  (mongoose.models['Achievement'] as IAchievementModel) ||
  mongoose.model<IAchievementDocument, IAchievementModel>('Achievement', achievementSchema);

export default Achievement;
