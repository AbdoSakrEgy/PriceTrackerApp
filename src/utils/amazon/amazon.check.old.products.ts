import { AmazonModel } from "../../modules/amazon/amazon.model";
import { amazonAIExtractor } from "./amazon.ai.extractor";

export async function amazonCheckOldProducts() {
  const updatedProductsArr: any = [];
  const allProducts = await AmazonModel.find();
  for (const product of allProducts) {
    // step: check product updates
    const currentProductData = await amazonAIExtractor(product.url);
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
    const updatedProduct = await AmazonModel.findOneAndUpdate(
      { url: product.url },
      { $push: { updateLog: newProductVersion } },
      { new: true }
    );
    updatedProductsArr.push(updatedProduct);
  }
  console.log("✅ amazonCheckOldProducts finished");
}
