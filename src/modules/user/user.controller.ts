import { Router } from "express";
import { UserServices } from "./user.service";
import { auth } from "../../core/middlewares/auth.middleware";
import { validation } from "../../core/middlewares/validation.middleware";
import {
  updateBasicInfoSchema,
  uploadProfileImageSchema,
  payWithStripeSchema,
} from "./user.validation";
import {
  fileTypes,
  multerUpload,
  StoreInEnum,
} from "../../utils/multer/multer.upload";
import { plan } from "../../core/middlewares/plan.middleware";
import { PricingPlanEnum } from "../../types/user.module.type";
const router = Router();
const userServices = new UserServices();

router.get("/user-profile",auth,plan([PricingPlanEnum.FREE]),userServices.userProfile);
router.get("/user-profile/:userId", auth, userServices.userProfile);
router.patch("/upload-profile-image",auth,multerUpload({ storeIn: StoreInEnum.disk, sendedFileDest: "profile" }).single("profileImage"),validation(uploadProfileImageSchema),userServices.uploadProfileImage);
router.delete("/delete-profile-image", auth, userServices.deleteProfileImage);
router.patch("/update-basic-info",auth,validation(updateBasicInfoSchema),userServices.updateBasicInfo);
router.post("/pay-with-stripe",auth,validation(payWithStripeSchema),userServices.payWithStripe);
router.post("/web-hook-with-stripe", userServices.webHookWithStripe);

export default router;
