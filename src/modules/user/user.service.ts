import { UserModel } from "./user.model";
import { successHandler } from "../../utils/successHandler";
import { NextFunction, Request, Response } from "express";
import {
  deleteMultiFilesDTO,
  createPresignedUrlToGetFileDTO,
  updateBasicInfoDTO,
  uploadAvatarImageDTO,
} from "./user.dto";
import { HydratedDocument } from "mongoose";
import { StoreInEnum } from "../../utils/multer/multer.upload";
import { ApplicationException } from "../../utils/Errors";
import { promisify } from "util";
import { pipeline } from "stream";
import { IUser, IUserServices } from "../../types/user.module.types";
const createS3WriteStreamPipe = promisify(pipeline);

export class UserServices implements IUserServices {
  private userModel = UserModel;

  constructor() {}
  // ============================ testDeploy ============================
  testDeploy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return successHandler({ res, result: { msg: "Hello in PriceVisionApp" } });
  };

  // ============================ userProfile ============================
  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    let user = res.locals.user;
    let userId = req.params?.userId;
    // step: if userId existence
    if (userId) {
      user = await this.userModel.findOne({ filter: { _id: userId } });
    }
    userId = user._id;
    return successHandler({ res, result: { user } });
  };

  // ============================ uploadProfileImage ============================
  uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return successHandler({ res });
  };

  // ============================ updateBasicInfo ============================
  updateBasicInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { firstName, lastName, age, gender, phone }: updateBasicInfoDTO =
      req.body;
    // step: update basic info
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { firstName, lastName, age, gender, phone } },
    });
    if (!updatedUser) {
      return successHandler({
        res,
        message: "Error while update user",
        status: 500,
      });
    }
    return successHandler({ res, message: "User updated successfully" });
  };
}
