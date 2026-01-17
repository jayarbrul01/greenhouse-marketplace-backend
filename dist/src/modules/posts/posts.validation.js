import { z } from "zod";
export const CreatePostSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        information: z.string().optional(),
        price: z.number().positive().optional(),
        region: z.string().optional(),
        category: z.string().optional(),
        image: z.string().url().optional().or(z.literal("")),
        video: z.string().url().optional().or(z.literal("")),
    })
});
export const UpdatePostSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        information: z.string().optional(),
        price: z.number().positive().optional(),
        region: z.string().optional(),
        category: z.string().optional(),
        image: z.string().url().optional().or(z.literal("")),
        video: z.string().url().optional().or(z.literal("")),
    })
});
//# sourceMappingURL=posts.validation.js.map