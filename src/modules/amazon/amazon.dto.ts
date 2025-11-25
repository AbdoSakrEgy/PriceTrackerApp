import z from "zod";
import {
  addProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./amazon.validation";

export type addProductDTO = z.infer<typeof addProductSchema>;
export type updateProductDTO = z.infer<typeof updateProductSchema>;
export type getProductDTO = z.infer<typeof getProductSchema>;
