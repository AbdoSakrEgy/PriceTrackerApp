"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.ProductModel = (0, mongoose_1.model)("product", productSchema);
