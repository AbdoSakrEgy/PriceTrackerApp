import { model, Schema, Types } from "mongoose";

export interface ITracker {
  url: string;
}

const trackerSchema = new Schema<ITracker>(
  {
    url: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const TrackerModel = model<ITracker>("tracker", trackerSchema);
