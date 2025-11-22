import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { TrackerServices } from "./tracker.service";
const router = Router();
const trackerServices = new TrackerServices();

router.post("/check-price", auth, trackerServices.checkPrices);

export default router;
