import z from "zod";

export const createRecipeSchema = z.object({
    title:z.string().min(2,"Title too short"),
    description:z.string().optional(),
    ingredients: z.array(z.string().min(1)).nonempty("At least one ingredient"),
    steps:z.array(z.string().min(1)).nonempty('should be atleast one ingridient'),
    image:z.string().url().optional(),
    tags:z.array(z.string()).optional(),
});