"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDataFromUrl = void 0;
const openai_1 = __importDefault(require("openai"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const openai = new openai_1.default({ apiKey: process.env.OPENAI_KEY });
function cleanAIResponse(content) {
    return content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
}
const extractDataFromUrl = async (url) => {
    // --------------------------
    // 1) Capture Screenshot
    // --------------------------
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60_000,
    });
    const screenshot = await page.screenshot({
        encoding: "base64",
        fullPage: true,
    });
    await browser.close();
    // --------------------------
    // 2) Send Screenshot to AI
    // --------------------------
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `
You are a product extraction engine. 
Extract **ALL** possible product data from the product page screenshot.

### REQUIRED FIELDS (fill as many as you can):
- title
- brand
- category
- description
- specifications (key-value table)
- price
- oldPrice
- discount
- currency
- seller
- rating
- reviewsCount
- availability
- deliveryInfo
- returnPolicy
- images (array of image URLs)
- mainImage
- sku
- model
- features (bullet points)
- shippingCost
- deliveryETA
- breadcrumbs (array)
- anyOtherData (object of extra info)

### RULES:
1. **Return ONLY RAW JSON**, no markdown, no explanation.
2. If something isn't found, put: null.
3. Always return valid JSON.
            `,
                    },
                    {
                        type: "image_url",
                        image_url: { url: `data:image/png;base64,${screenshot}` },
                    },
                ],
            },
        ],
    });
    let content = response.choices?.[0]?.message?.content;
    if (!content)
        throw new Error("AI response is empty");
    // --------------------------
    // 3) Cleanup Markdown
    // --------------------------
    content = cleanAIResponse(content);
    // --------------------------
    // 4) Safe JSON Parse
    // --------------------------
    try {
        return JSON.parse(content);
    }
    catch (err) {
        throw new Error("AI returned invalid JSON: " + content);
    }
};
exports.extractDataFromUrl = extractDataFromUrl;
