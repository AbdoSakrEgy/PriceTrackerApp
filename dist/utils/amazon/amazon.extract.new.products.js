"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNewProducts = extractNewProducts;
const amazon_model_1 = require("../../modules/amazon/amazon.model");
/**
 * ================================================
 * 🥇 extractNewProducts()
 * Compares discovered URLs with DB
 * Returns ONLY the new ones
 * ================================================
 */
async function extractNewProducts(discoveredUrls) {
    const existingProducts = await amazon_model_1.AmazonModel.find({}, { url: 1 });
    const existingUrls = existingProducts.map((p) => p.url);
    const newUrls = discoveredUrls.filter((url) => !existingUrls.includes(url));
    return newUrls;
}
