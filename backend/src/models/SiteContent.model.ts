import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type SiteContentSection = 'hero' | 'about' | 'mission' | 'contact' | 'footer';

export interface ISiteContent {
  sectionKey: SiteContentSection;
  contentPayload: Record<string, unknown>;
  updatedAt: Date;
}

export interface ISiteContentDocument extends ISiteContent, Document {}
export interface ISiteContentModel extends Model<ISiteContentDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const siteContentSchema = new Schema<ISiteContentDocument>(
  {
    sectionKey: {
      type: String,
      enum: ['hero', 'about', 'mission', 'contact', 'footer'] as const,
      required: [true, 'Section key is required'],
      unique: true,
      index: true,
    },
    contentPayload: {
      type: Schema.Types.Mixed,
      required: [true, 'Content payload is required'],
      default: {},
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

// ─── Model ────────────────────────────────────────────────────────────────
export const SiteContent: ISiteContentModel =
  (mongoose.models['SiteContent'] as ISiteContentModel) ||
  mongoose.model<ISiteContentDocument, ISiteContentModel>('SiteContent', siteContentSchema);

export default SiteContent;
