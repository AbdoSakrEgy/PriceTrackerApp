import { model, Schema, Types } from "mongoose";

export interface IProduct {
  url: string;
  image: string;
  title: string;
  seller: string;
  currentPrice: number;
  targetPrice: number;
  history: object[];
}

const productSchema = new Schema<IProduct>(
  {
    url: { type: String, required: true },
    image: { type: String },
    title: { type: String },
    seller: { type: String },
    currentPrice: { type: Number },
    targetPrice: { type: Number },
    history: [
      {
        price: { type: Number, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const ProductModel = model<IProduct>("product", productSchema);
