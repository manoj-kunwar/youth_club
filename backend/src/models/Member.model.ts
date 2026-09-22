import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type MemberRole =
  | 'president'
  | 'vice_president'
  | 'secretary'
  | 'treasurer'
  | 'executive'
  | 'member'
  | 'volunteer'
  | 'advisor';

export type MemberStatus = 'active' | 'inactive' | 'honorary';

export interface IMemberSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface IMember {
  fullName: string;
  nepaliName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role: MemberRole;
  position?: string;
  ward?: string;
  joinedDate?: Date;
  status: MemberStatus;
  bio?: string;
  skills: string[];
  socialLinks: IMemberSocialLinks;
  isVolunteer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMemberDocument extends IMember, Document {}
export interface IMemberModel extends Model<IMemberDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const memberSchema = new Schema<IMemberDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    nepaliName: { type: String, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    profileImage: { type: String, trim: true },
    role: {
      type: String,
      enum: ['president', 'vice_president', 'secretary', 'treasurer', 'executive', 'member', 'volunteer', 'advisor'] as const,
      default: 'member',
      required: true,
    },
    position: { type: String, trim: true },
    ward: { type: String, trim: true },
    joinedDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'inactive', 'honorary'] as const,
      default: 'active',
      index: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    skills: [{ type: String, trim: true }],
    socialLinks: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    isVolunteer: { type: Boolean, default: false, index: true },
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
memberSchema.index({ email: 1 }, { sparse: true });
memberSchema.index({ status: 1, role: 1 });
memberSchema.index({ isVolunteer: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const Member: IMemberModel =
  (mongoose.models['Member'] as IMemberModel) ||
  mongoose.model<IMemberDocument, IMemberModel>('Member', memberSchema);

export default Member;
