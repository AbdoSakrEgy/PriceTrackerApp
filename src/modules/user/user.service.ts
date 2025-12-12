import { UserModel } from "./user.model";
import { responseHandler } from "../../core/handlers/response.handler";
import { NextFunction, Request, Response } from "express";
import { IUserServices, PricingPlanEnum } from "../../types/user.module.type";
import {
  destroySingleFile,
  uploadSingleFile,
} from "../../utils/cloudinary/cloudinary.service";
import Stripe from "stripe";
import {
  createCheckoutSession,
  createCoupon,
} from "../../utils/stripe/stripe.service";
import { AppError } from "../../core/errors/app.error";
import { HttpStatusCode } from "../../core/http/http.status.code";

export class UserServices implements IUserServices {
  private userModel = UserModel;

  constructor() {}
  // ============================ userProfile ============================
  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    let user = res.locals.user;
    const userId = req.params?.userId;
    // step: if userId existence load that user
    if (userId) {
      const foundUser = await this.userModel.findById(userId);
      if (!foundUser) {
        throw new AppError(HttpStatusCode.NOT_FOUND, "User not found");
      }
      user = foundUser;
    }
    return responseHandler({ res, data: { user } });
  };

  // ============================ uploadProfileImage ============================
  uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const file = req.file;

    if (!file) {
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        "profileImage is required"
      );
    }

    const uploadResult = await uploadSingleFile({
      fileLocation: (file as any).path,
      storagePathOnCloudinary: `users/${user._id}/profile`,
    });

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { profileImage: uploadResult } },
      { new: true }
    );

    return responseHandler({
      res,
      message: "Profile image updated successfully",
      data: { user: updatedUser },
    });
  };

  // ============================ deleteProfileImage ============================
  deleteProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;

    const currentUser = await this.userModel.findById(user._id);
    if (currentUser?.profileImage?.public_id) {
      await destroySingleFile({
        public_id: currentUser.profileImage.public_id,
      });
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { $unset: { profileImage: "" } },
      { new: true }
    );

    return responseHandler({
      res,
      message: "Profile image deleted successfully",
      data: { user: updatedUser },
    });
  };

  // ============================ updateBasicInfo ============================
  updateBasicInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { firstName, lastName, age, gender, phone } = req.body;
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(age !== undefined && { age }),
          ...(gender && { gender }),
          ...(phone && { phone }),
        },
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    return responseHandler({
      res,
      message: "Basic info updated successfully",
      data: { user: updatedUser },
    });
  };

  // ============================ payWithStripe ============================
  payWithStripe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { plan, userCoupon } = req.body;
    // step: check coupon validation
    let checkCoupon = undefined;
    if (userCoupon) {
      const allowedCoupons = [
        { code: "ADF-DFA-31-DA", offer: 15 },
        { code: "JMY-GHR-65-CS", offer: 30 },
      ];
      checkCoupon = allowedCoupons.filter((item) => item.code == userCoupon)[0];
      if (!checkCoupon) {
        throw new AppError(HttpStatusCode.BAD_REQUEST, "Invalid coupon");
      }
    }
    // step: calculate plan price
    let costAmount = 0;
    if (plan == PricingPlanEnum.BASIC) {
      costAmount = 50;
    }
    if (plan == PricingPlanEnum.PRO) {
      costAmount = 100;
    }
    // step: collect createCheckoutSession data
    const line_items = [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `${user.firstName} will subscripe to ${plan} plan`,
            description: "plan description",
          },
          unit_amount: costAmount * 100,
        },
        quantity: 1,
      },
    ];
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (checkCoupon) {
      const coupon = await createCoupon({
        duration: "once",
        currency: "egp",
        percent_off: checkCoupon.offer,
      });
      discounts.push({ coupon: coupon.id });
    }
    // step: apply stripe services
    // createCheckoutSession
    const checkoutSession = await createCheckoutSession({
      customer_email: user.email,
      line_items,
      mode: "payment",
      discounts,
      metadata: { userId: user._id.toString(), plan },
    });
    // Store the checkout session ID for reference
    user.checkoutSessionId = checkoutSession.id;
    await user.save();
    return responseHandler({ res, data: { checkoutSession } });
  };

  // ============================ webHookWithStripe ============================
  webHookWithStripe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId, plan } = req.body.data.object.metadata;
    // step: check order existence
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          paymentIntentId: req.body.data.object.payment_intent,
          pricingPlan: plan,
          avaliableCredits: 200,
        },
      }
    );
    if (!user) throw new AppError(HttpStatusCode.NOT_FOUND, "User not found");
    return responseHandler({ res, message: "webHookWithStripe done" });
  };
}
