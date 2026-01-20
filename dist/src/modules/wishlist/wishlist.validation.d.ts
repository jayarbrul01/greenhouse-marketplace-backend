import { z } from "zod";
export declare const AddToWishlistSchema: z.ZodObject<{
    body: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const RemoveFromWishlistSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const GetWishlistSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=wishlist.validation.d.ts.map