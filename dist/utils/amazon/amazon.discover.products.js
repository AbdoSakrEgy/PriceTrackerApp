"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonAISearcher = amazonAISearcher;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const generative_ai_1 = require("@google/generative-ai");
const Errors_1 = require("../Errors");
/**
 * ================================================
 * 🥇 amazonAISearcher()
 * Scans Amazon New Releases and returns ALL product URLs
 * ================================================
 */
async function amazonAISearcher() {
  let browser;
  try {
    const targetUrl = "https://www.amazon.com/gp/new-releases";
    // Launch browser
    browser = await puppeteer_core_1.default.launch({
      headless: true,
      executablePath:
        process.env.CHROME_PATH ||
        "C:Program FilesGoogleChromeApplicationchrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("body", { timeout: 15000 });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Take screenshot
    const screenshot = await page.screenshot({
      encoding: "base64",
      type: "png",
      fullPage: true,
    });
    await browser.close();
    // Send screenshot to Gemini to extract all Amazon product URLs
    const urls = await extractUrlsFromScreenshot(screenshot);
    return urls;
  } catch (error) {
    if (browser) await browser.close();
    throw new Errors_1.ApplicationException(
      `Error discovering products: ${
        error instanceof Error ? error.message : error
      }`,
      500
    );
  }
}
/**
 * Extract URLs using AI (Gemini Vision)
 */
async function extractUrlsFromScreenshot(imageBase64) {
  const genAI = new generative_ai_1.GoogleGenerativeAI(
    process.env.GOOGLE_API_KEY
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
  const prompt = `
    Extract ALL Amazon product URLs from this screenshot.
    Return ONLY a raw JSON array of strings like:
    ["https://www.amazon.com/dp/xxxx", "https://www.amazon.com/dp/yyyy"]
    Important rules:
    - Only return product URLs
    - No markdown
    - No explanation
    - No duplicates
  `;
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: "image/png",
    },
  };
  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text().trim();
  const clean = text.replace(/```json|```/g, "").trim();
  const jsonMatch = clean.match(/\[.*\]/s);
  if (!jsonMatch) throw new Error("AI returned invalid URL list");
  const urls = JSON.parse(jsonMatch[0]);
  return urls.filter((url) => url.includes("amazon"));
}
