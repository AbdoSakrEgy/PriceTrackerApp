"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmazonProduct = getAmazonProduct;
const axios_1 = __importDefault(require("axios"));
async function getAmazonProduct(url) {
    const API_KEY = process.env.SCRAPER_API_KEY;
    const response = await axios_1.default.get(`http://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(url)}`);
    return response.data;
}
