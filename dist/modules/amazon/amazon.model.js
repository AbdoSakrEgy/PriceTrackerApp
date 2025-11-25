"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonModel = void 0;
const mongoose_1 = require("mongoose");
const amazonSchema = new mongoose_1.Schema({
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// model
exports.AmazonModel = (0, mongoose_1.model)("amazon", amazonSchema);
