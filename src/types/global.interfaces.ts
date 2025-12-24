import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";

export interface IAuthServcie {
  register(req: Request, res: Response, next: NextFunction): Promise<Response>;
  login(req: Request, res: Response, next: NextFunction): Promise<Response>;
  refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  confirmEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updateEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  resendEmailOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  logout(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export interface IUser {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  role: string;
  email: string;
  emailOtp: { otp: string; expiredAt: Date };
  newEmail: string;
  newEmailOtp: { otp: string; expiredAt: Date };
  emailConfirmed: Date;
  password: string;
  passwordOtp: { otp: string; expiredAt: Date };
  credentialsChangedAt: Date;
  isActive: boolean;
  deletedBy: mongoose.Schema.Types.ObjectId;
  is2FAActive: boolean;
  otp2FA: { otp: string; expiredAt: Date };
  profileImage: { public_id: string; secure_url: string };
  checkoutSessionId: string;
  paymentIntentId: string;
  refundId: string;
  refundedAt: Date;
  pricingPlan: string;
  avaliableCredits: number;
}

export interface IUserService {
  userProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadProfileVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadAvatarImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadCoverImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  getFile(req: Request, res: Response, next: NextFunction): Promise<Response>;
  deleteFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteMultiFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updateBasicInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

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
