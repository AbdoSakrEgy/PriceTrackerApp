"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAmazonData = extractAmazonData;
const cheerio_1 = __importDefault(require("cheerio"));
function extractAmazonData(html) {
    const $ = cheerio_1.default.load(html);
    const title = $("#productTitle").text().trim();
    const price = $("#priceblock_ourprice").text().trim() ||
        $("#priceblock_dealprice").text().trim() ||
        $(".a-price .a-offscreen").first().text().trim();
    return { title, price };
}
