import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'EVENT_MANAGER' | 'VOLUNTEER' | 'MEMBER';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface IUserProfile {
  supabaseUserId?: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  interests?: string[];
  bloodGroup?: string;
  dateOfBirth?: string;
  memberId?: string;
  adminId?: string;
  role: UserRole;
  status: UserStatus;
  volunteerHours?: number;
  eventsAttended?: number;
  youthLeaderRank?: string;
  projectsBacked?: number;
  volunteerActivities?: Array<{
    title: string;
    hours: number;
    date: Date;
    description?: string;
  }>;
  attendedEvents?: mongoose.Types.ObjectId[];
  backedProjects?: mongoose.Types.ObjectId[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastSignInAt?: Date;
  authProvider?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  activeSessions?: Array<{
    sessionId: string;
    device?: string;
    browser?: string;
    os?: string;
    ip?: string;
    lastActive: Date;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileDocument extends IUserProfile, Document {}

export interface IUserProfileModel extends Model<IUserProfileDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const userProfileSchema = new Schema<IUserProfileDocument>(
  {
    supabaseUserId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      select: false, // Do not expose password hash in normal queries
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    avatar: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    interests: [{
      type: String,
      trim: true,
    }],
    bloodGroup: {
      type: String,
      trim: true,
      maxlength: [10, 'Blood group cannot exceed 10 characters'],
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    memberId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    adminId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER', 'VOLUNTEER', 'MEMBER'] as const,
      default: 'MEMBER',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'] as const,
      default: 'active',
      required: true,
    },
    volunteerHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    eventsAttended: {
      type: Number,
      default: 0,
      min: 0,
    },
    youthLeaderRank: {
      type: String,
      default: 'Unranked',
      trim: true,
    },
    projectsBacked: {
      type: Number,
      default: 0,
      min: 0,
    },
    volunteerActivities: [
      {
        title: { type: String, required: true, trim: true },
        hours: { type: Number, required: true, min: 0 },
        date: { type: Date, default: Date.now },
        description: { type: String, trim: true },
      },
    ],
    attendedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    backedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: true,
    },
    lastSignInAt: {
      type: Date,
    },
    authProvider: {
      type: String,
      default: 'email',
      trim: true,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    activeSessions: [
      {
        sessionId: { type: String, required: true },
        device: { type: String, trim: true },
        browser: { type: String, trim: true },
        os: { type: String, trim: true },
        ip: { type: String, trim: true },
        lastActive: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>;
        delete r["__v"];
        delete r["passwordHash"];
        delete r["passwordResetToken"];
        delete r["passwordResetExpires"];
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
userProfileSchema.index({ role: 1, status: 1 });
userProfileSchema.index({ status: 1 });
userProfileSchema.index({ createdAt: -1 });
userProfileSchema.index({ phone: 1 }, { sparse: true });

// ─── Model ────────────────────────────────────────────────────────────────
export const UserProfile: IUserProfileModel =
  (mongoose.models['UserProfile'] as IUserProfileModel) ||
  mongoose.model<IUserProfileDocument, IUserProfileModel>('UserProfile', userProfileSchema);

export default UserProfile;
