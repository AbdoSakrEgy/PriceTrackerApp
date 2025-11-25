"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonAISearcher = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const Errors_1 = require("../Errors");
const amazonAISearcher = async () => {
    let browser;
    try {
        // Launch browser
        browser = await puppeteer_core_1.default.launch({
            headless: true,
            executablePath: process.env.CHROME_PATH ||
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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
        // Navigate to Amazon New Releases page
        await page.goto("https://www.amazon.com/gp/new-releases", {
            waitUntil: "networkidle2",
            timeout: 30000,
        });
        // Wait for product listings to load
        await page.waitForSelector("body", { timeout: 15000 });
        // Wait for dynamic content to load
        await new Promise((resolve) => setTimeout(resolve, 3000));
        // Extract product URLs directly from the page
        const productUrls = await page.evaluate(() => {
            const urls = [];
            // Find all product links on the page
            const links = document.querySelectorAll('a[href*="/dp/"], a[href*="/gp/product/"]');
            links.forEach((link) => {
                const href = link.href;
                // Extract clean product URL
                if (href && (href.includes("/dp/") || href.includes("/gp/product/"))) {
                    // Extract the product ID and create clean URL
                    const dpMatch = href.match(/\/dp\/([A-Z0-9]{10})/);
                    const productMatch = href.match(/\/gp\/product\/([A-Z0-9]{10})/);
                    if (dpMatch) {
                        urls.push(`https://www.amazon.com/dp/${dpMatch[1]}`);
                    }
                    else if (productMatch) {
                        urls.push(`https://www.amazon.com/dp/${productMatch[1]}`);
                    }
                }
            });
            return urls;
        });
        await browser.close();
        // Remove duplicates
        const uniqueUrls = [...new Set(productUrls)];
        if (uniqueUrls.length === 0) {
            throw new Errors_1.ApplicationException("No product URLs found on Amazon New Releases page", 404);
        }
        return uniqueUrls;
    }
    catch (error) {
        if (browser) {
            await browser.close();
        }
        throw new Errors_1.ApplicationException(`Error searching Amazon products: ${error instanceof Error ? error.message : error}`, 500);
    }
};
exports.amazonAISearcher = amazonAISearcher;
// Usage example:
// const urls = await amazonAISearcher();
// console.log(urls);
