import { Router } from "express";
import { UserServices } from "./user.service";
import { auth } from "../../middlewares/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import {
  updateBasicInfoSchema,
  uploadProfileImageSchema,
} from "./user.validation";
import {
  fileTypes,
  multerUpload,
  StoreInEnum,
} from "../../utils/multer/multer.upload";
const router = Router();
const userServices = new UserServices();

router.get("/test-deploy", userServices.testDeploy);
router.get("/user-profile", auth, userServices.userProfile);
router.get("/user-profile/:userId", auth, userServices.userProfile);
router.patch(
  "/upload-profile-image",
  auth,
  multerUpload({}).single("profileImage"),
  validation(uploadProfileImageSchema),
  userServices.uploadProfileImage
);
router.patch(
  "/update-basic-info",
  auth,
  validation(updateBasicInfoSchema),
  userServices.updateBasicInfo
);

export default router;
