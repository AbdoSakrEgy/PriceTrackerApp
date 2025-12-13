import puppeteer from "puppeteer-core";
import { AppError } from "../../core/errors/app.error";
import { HttpStatusCode } from "../../core/http/http.status.code";

export const amazonAISearcher = async (): Promise<string[]> => {
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        (process.env.CHROME_PATH as string) ||
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
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

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
      const urls: string[] = [];

      // Find all product links on the page
      const links = document.querySelectorAll(
        'a[href*="/dp/"], a[href*="/gp/product/"]'
      );

      links.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;

        // Extract clean product URL
        if (href && (href.includes("/dp/") || href.includes("/gp/product/"))) {
          // Extract the product ID and create clean URL
          const dpMatch = href.match(/\/dp\/([A-Z0-9]{10})/);
          const productMatch = href.match(/\/gp\/product\/([A-Z0-9]{10})/);

          if (dpMatch) {
            urls.push(`https://www.amazon.com/dp/${dpMatch[1]}`);
          } else if (productMatch) {
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
      throw new AppError(
        HttpStatusCode.NOT_FOUND,
        "No product URLs found on Amazon New Releases page"
      );
    }

    return uniqueUrls;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw new AppError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      `Error searching Amazon products: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

// Usage example:
// const urls = await amazonAISearcher();
// console.log(urls);
