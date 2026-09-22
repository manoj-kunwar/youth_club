import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export type RegistrationStatus = 'registered' | 'attended' | 'cancelled';

export interface IEventRegistration {
  eventId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  status: RegistrationStatus;
  notes?: string;
  registeredAt: Date;
  attendedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventRegistrationDocument extends IEventRegistration, Document {}
export interface IEventRegistrationModel extends Model<IEventRegistrationDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const eventRegistrationSchema = new Schema<IEventRegistrationDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Attendee email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'] as const,
      default: 'registered',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    attendedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>;
        delete r['__v'];
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ─── Compound Indexes ─────────────────────────────────────────────────────
// Unique registration per user per event when user is logged in
eventRegistrationSchema.index(
  { eventId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } }
);

// General lookup by event and email
eventRegistrationSchema.index({ eventId: 1, email: 1 });

// ─── Model ────────────────────────────────────────────────────────────────
export const EventRegistration: IEventRegistrationModel =
  (mongoose.models['EventRegistration'] as IEventRegistrationModel) ||
  mongoose.model<IEventRegistrationDocument, IEventRegistrationModel>('EventRegistration', eventRegistrationSchema);

export default EventRegistration;
