import { z } from "zod";
export declare const CreatePostSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        information: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        region: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        video: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const UpdatePostSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        information: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        region: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        video: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=posts.validation.d.ts.map