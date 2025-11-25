import { successHandler } from "../../utils/successHandler";
import { NextFunction, Request, Response } from "express";
import { IAmazonServices } from "../../types/amazon.modules.types";
import { AmazonModel } from "./amazon.model";
import { ApplicationException } from "../../utils/Errors";
import { amazonExtractor } from "../../utils/amazon/amazon.extractor";
import { addProductDTO, getProductDTO, updateProductDTO } from "./amazon.dto";

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
    if (checkUrl) throw new ApplicationException("URL already exists", 401);
    // step: extract product data
    const productData = await amazonExtractor(url);
    // step: add product
    const amazonProduct = await AmazonModel.create({ url, ...productData });
    return successHandler({
      res,
      message: "Amazon product added successfully",
      result: { amazonProduct },
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
    if (!product) throw new ApplicationException("Product not found", 404);
    // step: check product updates
    const currentProductData = await amazonExtractor(url);
    if (
      product.price == currentProductData.price &&
      product.originalPrice == currentProductData.originalPrice &&
      product.discount == currentProductData.discount &&
      product.availability == currentProductData.availability
    ) {
      return successHandler({ res, message: "No updates yet" });
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
    return successHandler({
      res,
      message: "Product updated successfully",
      result: { updatedProduct },
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
    if (!product) throw new ApplicationException("Product not found", 404);
    return successHandler({ res, result: { product } });
  };
}
