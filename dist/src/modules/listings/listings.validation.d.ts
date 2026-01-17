import { z } from "zod";
export declare const GetListingsSchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        region: z.ZodOptional<z.ZodString>;
        minPrice: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
        maxPrice: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
        page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=listings.validation.d.ts.map