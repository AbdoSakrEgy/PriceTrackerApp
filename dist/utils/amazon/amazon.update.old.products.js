"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonCheckOldProducts = amazonCheckOldProducts;
const amazon_model_1 = require("../../modules/amazon/amazon.model");
const amazon_ai_extractor_1 = require("./amazon.ai.extractor");
async function amazonCheckOldProducts() {
  const updatedProductsArr = [];
  const allProducts = await amazon_model_1.AmazonModel.find();
  for (const product of allProducts) {
    // step: check product updates
    const currentProductData = await (0,
    amazon_ai_extractor_1.amazonAIExtractor)(product.url);
    if (
      product.price == currentProductData.price &&
      product.originalPrice == currentProductData.originalPrice &&
      product.discount == currentProductData.discount &&
      product.availability == currentProductData.availability
    ) {
      break;
    }
    // step: update product
    const newProductVersion = {
      price: currentProductData.price,
      originalPrice: currentProductData.originalPrice,
      discount: currentProductData.discount,
      availability: currentProductData.availability,
    };
    const updatedProduct = await amazon_model_1.AmazonModel.findOneAndUpdate(
      { url: product.url },
      { $push: { updateLog: newProductVersion } },
      { new: true }
    );
    updatedProductsArr.push(updatedProduct);
  }
}
