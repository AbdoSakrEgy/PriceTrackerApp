"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductSchema = exports.updateProductSchema = exports.addProductSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.addProductSchema = zod_1.default.object({
    url: zod_1.default.string().nonempty(),
});
exports.updateProductSchema = zod_1.default.object({
    url: zod_1.default.string().nonempty(),
});
exports.getProductSchema = zod_1.default.object({
    url: zod_1.default.string().nonempty(),
});
