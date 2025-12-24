import { responseHandler } from "../../core/handlers/response.handler";
import { NextFunction, Request, Response } from "express";
import { IAmazonServices } from "../../types/global.interfaces";
import { AmazonModel } from "./amazon.model";
import { amazonAIExtractor } from "../../utils/amazon/amazon.ai.extractor";
import { addProductDTO, getProductDTO, updateProductDTO } from "./amazon.dto";
import { AppError } from "../../core/errors/app.error";
import { HttpStatusCode } from "../../core/http/http.status.code";

export class AmazonServices implements IAmazonServices {
  constructor() {}

  // ============================ addProduct ============================
  addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals;
    const { url } = req.body as addProductDTO;
    // step: check url existence
    const checkUrl = await AmazonModel.findOne({ url });
    if (checkUrl)
      throw new AppError(HttpStatusCode.BAD_REQUEST, "URL already exists");
    // step: extract product data
    const productData = await amazonAIExtractor(url);
    // step: add product
    const amazonProduct = await AmazonModel.create({ url, ...productData });
    return responseHandler({
      res,
      message: "Amazon product added successfully",
      data: { amazonProduct },
    });
  };

  // ============================ updateProduct ============================
  updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { url } = req.body as updateProductDTO;
    // step: check product existence
    const product = await AmazonModel.findOne({ url });
    if (!product)
      throw new AppError(HttpStatusCode.NOT_FOUND, "Product not found");
    // step: check product updates
    const currentProductData = await amazonAIExtractor(url);
    if (
      product.price == currentProductData.price &&
      product.originalPrice == currentProductData.originalPrice &&
      product.discount == currentProductData.discount &&
      product.availability == currentProductData.availability
    ) {
      return responseHandler({ res, message: "No updates yet" });
    }
    // step: update product
    const newProductVersion = {
      price: currentProductData.price,
      originalPrice: currentProductData.originalPrice,
      discount: currentProductData.discount,
      availability: currentProductData.availability,
    };
    const updatedProduct = await AmazonModel.findOneAndUpdate(
      { url },
      { $push: { updateLog: newProductVersion } },
      { new: true }
    );
    return responseHandler({
      res,
      message: "Product updated successfully",
      data: { updatedProduct },
    });
  };

  // ============================ getProduct ============================
  getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { url } = req.body as getProductDTO;
    // step: check product existence
    const product = await AmazonModel.findOne({ url });
    if (!product)
      throw new AppError(HttpStatusCode.NOT_FOUND, "Product not found");
    return responseHandler({ res, data: { product } });
  };
}
