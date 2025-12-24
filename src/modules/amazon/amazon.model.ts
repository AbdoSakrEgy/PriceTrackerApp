import { model, Schema } from "mongoose";
import { IAmazon } from "../../types/global.interfaces";

const amazonSchema = new Schema<IAmazon>(
  {
    url: { type: String, required: true },
    title: { type: String },
    price: { type: Number },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    rating: { type: Number },
    reviewCount: { type: Number },
    seller: { type: String },
    availability: { type: String },
    description: { type: String },
    image: { type: String },
    category: { type: String },
    updateLog: [
      {
        price: Number,
        originalPrice: Number,
        discount: Number,
        availability: String,
        scrapedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// model
export const AmazonModel = model<IAmazon>("amazon", amazonSchema);
