import { Router } from "express";
const router = Router();
import userRouter from "./modules/user/user.controller";
import authRouter from "./modules/auth/auth.controller";
import amazonRouter from "./modules/amazon/amazon.controller";

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/amazon", amazonRouter);

export default router;
