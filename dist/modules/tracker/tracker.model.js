"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerModel = void 0;
const mongoose_1 = require("mongoose");
const trackerSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.TrackerModel = (0, mongoose_1.model)("tracker", trackerSchema);
