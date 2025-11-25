import { AmazonModel } from "../../modules/amazon/amazon.model";
import { amazonAIExtractor } from "./amazon.ai.extractor";
import { amazonAISearcher } from "./amazon.ai.searcher";

const VALID_PRODUCT_URL =
  /(?:\/dp\/[A-Z0-9]{8,12}|\/gp\/product\/[A-Z0-9]{8,12})/i;

export async function amazonCheckNewProducts() {
  const discoveredUrls = await amazonAISearcher();
  // step: filter only REAL product URLs
  const filteredProductUrls = discoveredUrls.filter((url) =>
    VALID_PRODUCT_URL.test(url)
  );
  // step: filter new urls
  const existingProducts = await AmazonModel.find({}, { url: 1 });
  const existingUrls = existingProducts.map((p) => p.url);
  // step: remove duplicates + skip existing
  const newUrls = filteredProductUrls.filter(
    (url) => !existingUrls.includes(url)
  );
  // step: loop on new products
  for (const url of newUrls) {
    // step: use amazonAIExtractor
    try {
      const productData = await amazonAIExtractor(url);
      const newProduct = await AmazonModel.create({ url, ...productData });
      console.log("✅ New product added successfully", { newProduct });
    } catch (err) {
      console.error("❌ Failed to extract product:", url, err);
      continue; // skip broken URL
    }
  }
  console.log("✅ amazonCheckNewProducts finished");
}
