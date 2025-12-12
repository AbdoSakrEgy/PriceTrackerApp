"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonServices = void 0;
const response_handler_1 = require("../../core/handlers/response.handler");
const amazon_model_1 = require("./amazon.model");
const amazon_ai_extractor_1 = require("../../utils/amazon/amazon.ai.extractor");
const app_error_1 = require("../../core/errors/app.error");
const http_status_code_1 = require("../../core/http/http.status.code");
class AmazonServices {
    constructor() { }
    // ============================ addProduct ============================
    addProduct = async (req, res, next) => {
        const user = res.locals;
        const { url } = req.body;
        // step: check url existence
        const checkUrl = await amazon_model_1.AmazonModel.findOne({ url });
        if (checkUrl)
            throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.BAD_REQUEST, "URL already exists");
        // step: extract product data
        const productData = await (0, amazon_ai_extractor_1.amazonAIExtractor)(url);
        // step: add product
        const amazonProduct = await amazon_model_1.AmazonModel.create({ url, ...productData });
        return (0, response_handler_1.responseHandler)({
            res,
            message: "Amazon product added successfully",
            data: { amazonProduct },
        });
    };
    // ============================ updateProduct ============================
    updateProduct = async (req, res, next) => {
        const { url } = req.body;
        // step: check product existence
        const product = await amazon_model_1.AmazonModel.findOne({ url });
        if (!product)
            throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "Product not found");
        // step: check product updates
        const currentProductData = await (0, amazon_ai_extractor_1.amazonAIExtractor)(url);
        if (product.price == currentProductData.price &&
            product.originalPrice == currentProductData.originalPrice &&
            product.discount == currentProductData.discount &&
            product.availability == currentProductData.availability) {
            return (0, response_handler_1.responseHandler)({ res, message: "No updates yet" });
        }
        // step: update product
        const newProductVersion = {
            price: currentProductData.price,
            originalPrice: currentProductData.originalPrice,
            discount: currentProductData.discount,
            availability: currentProductData.availability,
        };
        const updatedProduct = await amazon_model_1.AmazonModel.findOneAndUpdate({ url }, { $push: { updateLog: newProductVersion } }, { new: true });
        return (0, response_handler_1.responseHandler)({
            res,
            message: "Product updated successfully",
            data: { updatedProduct },
        });
    };
    // ============================ getProduct ============================
    getProduct = async (req, res, next) => {
        const { url } = req.body;
        // step: check product existence
        const product = await amazon_model_1.AmazonModel.findOne({ url });
        if (!product)
            throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "Product not found");
        return (0, response_handler_1.responseHandler)({ res, data: { product } });
    };
}
exports.AmazonServices = AmazonServices;
