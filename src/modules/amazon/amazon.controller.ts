import { Router } from "express";
import { auth } from "../../core/middlewares/auth.middleware";
import { AmazonServices } from "./amazon.service";
import { validation } from "../../core/middlewares/validation.middleware";
import {
  addProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./amazon.validation";
const router = Router();
const amazonServices = new AmazonServices();

router.post("/add-product",auth,validation(addProductSchema),amazonServices.addProduct);
router.patch("/update-product",auth,validation(updateProductSchema),amazonServices.updateProduct);
router.get("/get-product",auth,validation(getProductSchema),amazonServices.getProduct);

export default router;
