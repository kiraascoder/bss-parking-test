import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(1, "Description is required"), 
  image: z.string().url("Must be a valid URL"), 
});

export type ProductForm = z.infer<typeof productSchema>;
