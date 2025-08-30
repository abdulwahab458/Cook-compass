import { z } from "zod";

const createRecipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  ingredients: z
    .array(z.string().min(1, "Ingredient cannot be empty"))
    .min(1, "At least one ingredient is required"),
  steps: z
    .array(z.string().min(1, "Step cannot be empty"))
    .min(1, "At least one step is required"),
  tags: z.array(z.string()).optional(),
  image: z.string().min(1, "Image is required"),
});
