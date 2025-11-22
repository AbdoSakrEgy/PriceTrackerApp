import { NextFunction, Request, Response } from "express";
import { ProductRepo } from "./product.repo";
import { successHandler } from "../../utils/successHandler";
import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer-core";
import { extractDataFromUrl } from "../../utils/ai/aiExtractor";

interface IProductServices {
  createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

export class ProductServices implements IProductServices {
  private productRepo = new ProductRepo();

  constructor() {}
  // ============================ createProduct ============================
  createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { url, title, seller, currentPrice, targetPrice, history } = req.body;
    // step: check if products existence
    const checkProduct = await this.productRepo.findOne({ filter: { url } });
    if (checkProduct) {
      return successHandler({
        res,
        status: 401,
        message: "Product already exists",
      });
    }
    // step: create product
    const product = await this.productRepo.create({ data: { ...req.body } });
    return successHandler({
      res,
      message: "Product created successfully",
      result: { product },
    });
  };

  // ============================ extracktProductData ============================
  extracktProductData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { url } = req.body;

    if (!url) {
      return successHandler({
        res,
        status: 400,
        message: "URL is required",
      });
    }

    const productData = await extractDataFromUrl(url);

    return successHandler({
      res,
      message: "Product data extracted successfully",
      result: productData,
    });
  };
}
