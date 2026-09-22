import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export interface ISiteSettingsSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface ISiteSettings {
  orgName: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialLinks: ISiteSettingsSocialLinks;
  portalConfig: Record<string, unknown>;
  updatedAt: Date;
}

export interface ISiteSettingsDocument extends ISiteSettings, Document {}
export interface ISiteSettingsModel extends Model<ISiteSettingsDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const siteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    orgName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    logoUrl: { type: String, trim: true },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    socialLinks: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      youtube: { type: String, trim: true },
      tiktok: { type: String, trim: true },
      whatsapp: { type: String, trim: true },
    },
    portalConfig: {
      type: Schema.Types.Mixed,
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

// ─── Model ────────────────────────────────────────────────────────────────
// SiteSettings is a singleton — only one document exists.
export const SiteSettings: ISiteSettingsModel =
  (mongoose.models['SiteSettings'] as ISiteSettingsModel) ||
  mongoose.model<ISiteSettingsDocument, ISiteSettingsModel>('SiteSettings', siteSettingsSchema);

export default SiteSettings;
