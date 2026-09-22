import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── TypeScript Interface ──────────────────────────────────────────────────
export interface IAuditLog {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document {}
export interface IAuditLogModel extends Model<IAuditLogDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────
const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: [true, 'User ID is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters'],
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
      trim: true,
      index: true,
    },
    resourceId: {
      type: String,
      trim: true,
      index: true,
    },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    // Audit logs should NOT be modified after creation
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => { const r = ret as Record<string, unknown>; delete r["__v"]; return ret; },
    },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ timestamp: -1 });
// TTL index: auto-delete audit logs after 2 years (security compliance)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

// ─── Model ────────────────────────────────────────────────────────────────
export const AuditLog: IAuditLogModel =
  (mongoose.models['AuditLog'] as IAuditLogModel) ||
  mongoose.model<IAuditLogDocument, IAuditLogModel>('AuditLog', auditLogSchema);

export default AuditLog;
