"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonServices = void 0;
const successHandler_1 = require("../../utils/successHandler");
const amazon_model_1 = require("./amazon.model");
const Errors_1 = require("../../utils/Errors");
const amazon_extractor_1 = require("../../utils/amazon/amazon.extractor");
class AmazonServices {
    constructor() { }
    // ============================ addProduct ============================
    addProduct = async (req, res, next) => {
        const user = res.locals;
        const { url } = req.body;
        // step: check url existence
        const checkUrl = await amazon_model_1.AmazonModel.findOne({ url });
        if (checkUrl)
            throw new Errors_1.ApplicationException("URL already exists", 401);
        // step: extract product data
        const productData = await (0, amazon_extractor_1.amazonExtractor)(url);
        // step: add product
        const amazonProduct = await amazon_model_1.AmazonModel.create({ url, ...productData });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Amazon product added successfully",
            result: { amazonProduct },
        });
    };
    // ============================ updateProduct ============================
    updateProduct = async (req, res, next) => {
        const { url } = req.body;
        // step: check product existence
        const product = await amazon_model_1.AmazonModel.findOne({ url });
        if (!product)
            throw new Errors_1.ApplicationException("Product not found", 404);
        // step: check product updates
        const currentProductData = await (0, amazon_extractor_1.amazonExtractor)(url);
        if (product.price == currentProductData.price &&
            product.originalPrice == currentProductData.originalPrice &&
            product.discount == currentProductData.discount &&
            product.availability == currentProductData.availability) {
            return (0, successHandler_1.successHandler)({ res, message: "No updates yet" });
        }
        // step: update product
        const newProductVersion = {
            price: currentProductData.price,
            originalPrice: currentProductData.originalPrice,
            discount: currentProductData.discount,
            availability: currentProductData.availability,
        };
        const updatedProduct = await amazon_model_1.AmazonModel.findOneAndUpdate({ url }, { $push: { updateLog: newProductVersion } }, { new: true });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Product updated successfully",
            result: { updatedProduct },
        });
    };
    // ============================ getProduct ============================
    getProduct = async (req, res, next) => {
        const { url } = req.body;
        // step: check product existence
        const product = await amazon_model_1.AmazonModel.findOne({ url });
        if (!product)
            throw new Errors_1.ApplicationException("Product not found", 404);
        return (0, successHandler_1.successHandler)({ res, result: { product } });
    };
}
exports.AmazonServices = AmazonServices;
