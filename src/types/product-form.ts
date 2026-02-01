import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export type ProductForm = z.infer<typeof productSchema>;
