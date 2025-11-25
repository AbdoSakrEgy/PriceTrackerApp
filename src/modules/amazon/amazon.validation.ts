import z from "zod";

export const addProductSchema = z.object({
  url: z.string().nonempty(),
});

export const updateProductSchema = z.object({
  url: z.string().nonempty(),
});

export const getProductSchema = z.object({
  url: z.string().nonempty(),
});
