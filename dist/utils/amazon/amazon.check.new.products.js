"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonCheckNewProducts = amazonCheckNewProducts;
const amazon_model_1 = require("../../modules/amazon/amazon.model");
const amazon_ai_extractor_1 = require("./amazon.ai.extractor");
const amazon_ai_searcher_1 = require("./amazon.ai.searcher");
const VALID_PRODUCT_URL = /(?:\/dp\/[A-Z0-9]{8,12}|\/gp\/product\/[A-Z0-9]{8,12})/i;
async function amazonCheckNewProducts() {
    const discoveredUrls = await (0, amazon_ai_searcher_1.amazonAISearcher)();
    // step: filter only REAL product URLs
    const filteredProductUrls = discoveredUrls.filter((url) => VALID_PRODUCT_URL.test(url));
    // step: filter new urls
    const existingProducts = await amazon_model_1.AmazonModel.find({}, { url: 1 });
    const existingUrls = existingProducts.map((p) => p.url);
    // step: remove duplicates + skip existing
    const newUrls = filteredProductUrls.filter((url) => !existingUrls.includes(url));
    // step: loop on new products
    for (const url of newUrls) {
        // step: use amazonAIExtractor
        try {
            const productData = await (0, amazon_ai_extractor_1.amazonAIExtractor)(url);
            const newProduct = await amazon_model_1.AmazonModel.create({ url, ...productData });
            console.log("✅ New product added successfully", { newProduct });
        }
        catch (err) {
            console.error("❌ Failed to extract product:", url, err);
            continue; // skip broken URL
        }
    }
    console.log("✅ amazonCheckNewProducts finished");
}
