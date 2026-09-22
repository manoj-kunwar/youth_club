import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICounter {
  _id: string;
  seq: number;
}

export interface ICounterDocument extends Document {
  _id: any;
  seq: number;
}

const counterSchema = new Schema<ICounterDocument>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Counter: Model<ICounterDocument> =
  (mongoose.models['Counter'] as Model<ICounterDocument>) ||
  mongoose.model<ICounterDocument>('Counter', counterSchema);

export default Counter;
