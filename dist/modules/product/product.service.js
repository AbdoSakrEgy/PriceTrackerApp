"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const product_repo_1 = require("./product.repo");
const successHandler_1 = require("../../utils/successHandler");
const amazon_extractor_1 = require("../../utils/extractors/amazon.extractor");
class ProductServices {
  productRepo = new product_repo_1.ProductRepo();
  constructor() {}
  // ============================ createProduct ============================
  createProduct = async (req, res, next) => {
    const { url, title, seller, currentPrice, targetPrice, history } = req.body;
    // step: check if products existence
    const checkProduct = await this.productRepo.findOne({ filter: { url } });
    if (checkProduct) {
      return (0, successHandler_1.successHandler)({
        res,
        status: 401,
        message: "Product already exists",
      });
    }
    // step: create product
    const product = await this.productRepo.create({ data: { ...req.body } });
    return (0, successHandler_1.successHandler)({
      res,
      message: "Product created successfully",
      result: { product },
    });
  };
  // ============================ extracktProductData ============================
  extracktProductData = async (req, res, next) => {
    const { url } = req.body;
    if (!url) {
      return (0, successHandler_1.successHandler)({
        res,
        status: 400,
        message: "URL is required",
      });
    }
    const productData = await (0, amazon_extractor_1.amazonAIExtractor)(url);
    return (0, successHandler_1.successHandler)({
      res,
      message: "Product data extracted successfully",
      result: productData,
    });
  };
}
exports.ProductServices = ProductServices;
