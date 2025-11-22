import { Router } from "express";
const router = Router();
import userRouter from "./modules/user/user.controller";
import authRouter from "./modules/auth/auth.controller";
import productRouter from "./modules/product/product.controller";
import trackerRouter from "./modules/tracker/tracker.controller";

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/tracker", trackerRouter);

export default router;
