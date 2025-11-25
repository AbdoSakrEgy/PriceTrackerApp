import { NextFunction, Request, Response } from "express";

export interface IAmazon {
  url: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  seller: string;
  availability: string;
  description: string;
  image: string;
  category: string;
  updateLog: object[];
}

export interface IAmazonServices {
  addProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}
