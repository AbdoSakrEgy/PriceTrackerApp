"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const successHandler_1 = require("../../utils/successHandler");
const util_1 = require("util");
const stream_1 = require("stream");
const createS3WriteStreamPipe = (0, util_1.promisify)(stream_1.pipeline);
class UserServices {
    userModel = user_model_1.UserModel;
    constructor() { }
    // ============================ testDeploy ============================
    testDeploy = async (req, res, next) => {
        return (0, successHandler_1.successHandler)({ res, result: { msg: "Hello in PriceVisionApp" } });
    };
    // ============================ userProfile ============================
    userProfile = async (req, res, next) => {
        let user = res.locals.user;
        let userId = req.params?.userId;
        // step: if userId existence
        if (userId) {
            user = await this.userModel.findOne({ filter: { _id: userId } });
        }
        userId = user._id;
        return (0, successHandler_1.successHandler)({ res, result: { user } });
    };
    // ============================ uploadProfileImage ============================
    uploadProfileImage = async (req, res, next) => {
        return (0, successHandler_1.successHandler)({ res });
    };
    // ============================ updateBasicInfo ============================
    updateBasicInfo = async (req, res, next) => {
        const user = res.locals.user;
        const { firstName, lastName, age, gender, phone } = req.body;
        // step: update basic info
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { firstName, lastName, age, gender, phone } },
        });
        if (!updatedUser) {
            return (0, successHandler_1.successHandler)({
                res,
                message: "Error while update user",
                status: 500,
            });
        }
        return (0, successHandler_1.successHandler)({ res, message: "User updated successfully" });
    };
}
exports.UserServices = UserServices;
