"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonAIExtractor = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const generative_ai_1 = require("@google/generative-ai");
const Errors_1 = require("../Errors");
const amazonAIExtractor = async (url) => {
    let browser;
    try {
        // Validate URL
        if (!url || !url.includes("amazon")) {
            throw new Errors_1.ApplicationException("Invalid Amazon URL", 400);
        }
        // Launch browser
        browser = await puppeteer_core_1.default.launch({
            headless: true,
            executablePath: process.env.CHROME_PATH ||
                "C:Program FilesGoogleChromeApplicationchrome.exe",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });
        const page = await browser.newPage();
        // Set user agent
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        await page.setViewport({ width: 1920, height: 1080 });
        // Navigate to product page
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });
        // Wait for product content
        await page.waitForSelector("#dp-container, #ppd, [data-feature-name='dp-top-section']", { timeout: 15000 });
        // Wait for dynamic content to load
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Take screenshot
        const screenshot = await page.screenshot({
            encoding: "base64",
            type: "png",
            fullPage: false,
        });
        // Extract data using Gemini (FREE)
        const productData = await extractDataFromScreenshot(screenshot);
        await browser.close();
        return productData;
    }
    catch (error) {
        if (browser) {
            await browser.close();
        }
        throw new Errors_1.ApplicationException(`Error extracting Amazon product data: ${error instanceof Error ? error.message : error}`, 500);
    }
};
exports.amazonAIExtractor = amazonAIExtractor;
// Extract data using Google Gemini (FREE!)
const extractDataFromScreenshot = async (base64Image) => {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // Use Gemini 1.5 Flash (free tier, good for vision)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        const prompt = `Analyze this Amazon product page screenshot and extract the following information. Return ONLY a valid JSON object with no additional text, markdown, or code blocks:
                    {
                      "title": "full product title",
                      "price": <current price as number (extract just the number, no currency symbols)>,
                      "originalPrice": <original/crossed-out price as number or null if not shown>,
                      "discount": <discount percentage as number or null if not shown>,
                      "rating": <star rating as number (e.g., 4.5) or null>,
                      "reviewCount": <total number of reviews as number or null>,
                      "seller": "seller/brand name or null",
                      "availability": "in stock/out of stock/availability status",
                      "description": "brief product description if visible"
                      "image": "<URL of the main product image>",
                      "category": "<the product's main category/breadcrumb (e.g., 'Electronics', 'Home & Kitchen') or null>"
                    }
                    Important:
                    - Extract prices as pure numbers (e.g., 29.99 not "$29.99")
                    - If a field is not visible, use null
                    - Return valid JSON only, no markdown formatting`;
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: "image/png",
            },
        };
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();
        // Clean response - remove markdown code blocks if present
        let cleanText = text.trim();
        cleanText = cleanText.replace(/```json\n?/g, "");
        cleanText = cleanText.replace(/```\n?/g, "");
        cleanText = cleanText.trim();
        // Extract JSON
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Errors_1.ApplicationException("Could not parse AI response as JSON", 500);
        }
        const extractedData = JSON.parse(jsonMatch[0]);
        // Validate and structure the data
        const productData = {
            title: extractedData.title || "Unknown Product",
            price: parseFloat(extractedData.price) || 0,
            availability: extractedData.availability || "Unknown",
        };
        // Add optional fields only if they exist
        if (extractedData.originalPrice) {
            productData.originalPrice = parseFloat(extractedData.originalPrice);
        }
        if (extractedData.discount) {
            productData.discount = parseFloat(extractedData.discount);
        }
        if (extractedData.rating) {
            productData.rating = parseFloat(extractedData.rating);
        }
        if (extractedData.reviewCount) {
            productData.reviewCount = parseInt(extractedData.reviewCount);
        }
        if (extractedData.seller) {
            productData.seller = extractedData.seller;
        }
        if (extractedData.description) {
            productData.description = extractedData.description;
        }
        if (extractedData.image) {
            productData.image = extractedData.image;
        }
        if (extractedData.category) {
            productData.category = extractedData.category;
        }
        return productData;
    }
    catch (error) {
        throw new Errors_1.ApplicationException(`Error processing screenshot with AI: ${error instanceof Error ? error.message : error}`, 500);
    }
};
// Usage example:
// const data = await amazonAIExtractor("https://www.amazon.com/dp/B08N5WRWNW");
// console.log(data);
