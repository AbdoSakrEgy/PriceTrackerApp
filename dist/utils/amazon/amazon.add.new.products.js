"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonCheckNewProducts = amazonCheckNewProducts;
const amazon_model_1 = require("../../modules/amazon/amazon.model");
const amazon_ai_extractor_1 = require("./amazon.ai.extractor");
async function amazonCheckNewProducts(discoveredUrls) {
  // step: filter new urls
  const existingProducts = await amazon_model_1.AmazonModel.find(
    {},
    { url: 1 }
  );
  const existingUrls = existingProducts.map((p) => p.url);
  const newUrls = discoveredUrls.filter((url) => !existingUrls.includes(url));
  // step: loop on new products
  for (const url of newUrls) {
    // use amazonAIExtractor
    const productData = await (0, amazon_ai_extractor_1.amazonAIExtractor)(url);
    const product = await amazon_model_1.AmazonModel.create({ ...productData });
  }
}
