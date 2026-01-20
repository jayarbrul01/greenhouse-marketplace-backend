import { z } from "zod";

export const AddToWishlistSchema = z.object({
  body: z.object({
    postId: z.string().min(1, "Post ID is required"),
  }),
});

export const RemoveFromWishlistSchema = z.object({
  params: z.object({
    postId: z.string().min(1, "Post ID is required"),
  }),
});

export const GetWishlistSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 12)),
  }),
});
