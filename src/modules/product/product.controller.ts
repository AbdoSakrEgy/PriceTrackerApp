import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { ProductServices } from "./product.service";
const router = Router();
const productServices = new ProductServices();

router.post("/create-product", auth, productServices.createProduct);
router.post("/extract-product-data", auth, productServices.extracktProductData);

export default router;
