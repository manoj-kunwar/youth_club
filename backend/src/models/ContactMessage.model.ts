import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export interface IContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessageDocument extends IContactMessage, Document {}
export interface IContactMessageModel extends Model<IContactMessageDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const contactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    isRead: { type: Boolean, default: false, index: true },
    isArchived: { type: Boolean, default: false, index: true },
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
contactMessageSchema.index({ isRead: 1, isArchived: 1, createdAt: -1 });
contactMessageSchema.index({ createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const ContactMessage: IContactMessageModel =
  (mongoose.models['ContactMessage'] as IContactMessageModel) ||
  mongoose.model<IContactMessageDocument, IContactMessageModel>('ContactMessage', contactMessageSchema);

export default ContactMessage;
