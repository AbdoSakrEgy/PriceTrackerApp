"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const response_handler_1 = require("../../core/handlers/response.handler");
const user_module_type_1 = require("../../types/user.module.type");
const cloudinary_service_1 = require("../../utils/cloudinary/cloudinary.service");
const stripe_service_1 = require("../../utils/stripe/stripe.service");
const app_error_1 = require("../../core/errors/app.error");
const http_status_code_1 = require("../../core/http/http.status.code");
class UserServices {
    userModel = user_model_1.UserModel;
    constructor() { }
    // ============================ userProfile ============================
    userProfile = async (req, res, next) => {
        let user = res.locals.user;
        const userId = req.params?.userId;
        // step: if userId existence load that user
        if (userId) {
            const foundUser = await this.userModel.findById(userId);
            if (!foundUser) {
                throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "User not found");
            }
            user = foundUser;
        }
        return (0, response_handler_1.responseHandler)({ res, data: { user } });
    };
    // ============================ uploadProfileImage ============================
    uploadProfileImage = async (req, res, next) => {
        const user = res.locals.user;
        const file = req.file;
        if (!file) {
            throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.BAD_REQUEST, "profileImage is required");
        }
        const uploadResult = await (0, cloudinary_service_1.uploadSingleFile)({
            fileLocation: file.path,
            storagePathOnCloudinary: `users/${user._id}/profile`,
        });
        const updatedUser = await this.userModel.findOneAndUpdate({ _id: user._id }, { $set: { profileImage: uploadResult } }, { new: true });
        return (0, response_handler_1.responseHandler)({
            res,
            message: "Profile image updated successfully",
            data: { user: updatedUser },
        });
    };
    // ============================ deleteProfileImage ============================
    deleteProfileImage = async (req, res, next) => {
        const user = res.locals.user;
        const currentUser = await this.userModel.findById(user._id);
        if (currentUser?.profileImage?.public_id) {
            await (0, cloudinary_service_1.destroySingleFile)({
                public_id: currentUser.profileImage.public_id,
            });
        }
        const updatedUser = await this.userModel.findOneAndUpdate({ _id: user._id }, { $unset: { profileImage: "" } }, { new: true });
        return (0, response_handler_1.responseHandler)({
            res,
            message: "Profile image deleted successfully",
            data: { user: updatedUser },
        });
    };
    // ============================ updateBasicInfo ============================
    updateBasicInfo = async (req, res, next) => {
        const user = res.locals.user;
        const { firstName, lastName, age, gender, phone } = req.body;
        const updatedUser = await this.userModel.findOneAndUpdate({ _id: user._id }, {
            $set: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(age !== undefined && { age }),
                ...(gender && { gender }),
                ...(phone && { phone }),
            },
        }, {
            new: true,
            runValidators: true,
            context: "query",
        });
        return (0, response_handler_1.responseHandler)({
            res,
            message: "Basic info updated successfully",
            data: { user: updatedUser },
        });
    };
    // ============================ payWithStripe ============================
    payWithStripe = async (req, res, next) => {
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
                throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.BAD_REQUEST, "Invalid coupon");
            }
        }
        // step: calculate plan price
        let costAmount = 0;
        if (plan == user_module_type_1.PricingPlanEnum.BASIC) {
            costAmount = 50;
        }
        if (plan == user_module_type_1.PricingPlanEnum.PRO) {
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
        const discounts = [];
        if (checkCoupon) {
            const coupon = await (0, stripe_service_1.createCoupon)({
                duration: "once",
                currency: "egp",
                percent_off: checkCoupon.offer,
            });
            discounts.push({ coupon: coupon.id });
        }
        // step: apply stripe services
        // createCheckoutSession
        const checkoutSession = await (0, stripe_service_1.createCheckoutSession)({
            customer_email: user.email,
            line_items,
            mode: "payment",
            discounts,
            metadata: { userId: user._id.toString(), plan },
        });
        // Store the checkout session ID for reference
        user.checkoutSessionId = checkoutSession.id;
        await user.save();
        return (0, response_handler_1.responseHandler)({ res, data: { checkoutSession } });
    };
    // ============================ webHookWithStripe ============================
    webHookWithStripe = async (req, res, next) => {
        const { userId, plan } = req.body.data.object.metadata;
        // step: check order existence
        const user = await user_model_1.UserModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                paymentIntentId: req.body.data.object.payment_intent,
                pricingPlan: plan,
                avaliableCredits: 200,
            },
        });
        if (!user)
            throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "User not found");
        return (0, response_handler_1.responseHandler)({ res, message: "webHookWithStripe done" });
    };
}
exports.UserServices = UserServices;
