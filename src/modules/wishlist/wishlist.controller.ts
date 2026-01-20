import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { wishlistService } from "./wishlist.service.js";

export const wishlistController = {
  async addToWishlist(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const wishlistItem = await wishlistService.addToWishlist(userId, postId);
    res.status(201).json(wishlistItem);
  },

  async removeFromWishlist(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.postId;

    if (!postId || Array.isArray(postId)) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const result = await wishlistService.removeFromWishlist(userId, postId);
    res.json(result);
  },

  async getUserWishlist(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const result = await wishlistService.getUserWishlist(userId, page, limit);
    res.json(result);
  },

  async checkWishlistStatus(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const postIds = req.query.postIds as string;

    if (!postIds) {
      return res.status(400).json({ message: "Post IDs are required" });
    }

    const postIdsArray = postIds.split(",").filter((id) => id.trim());
    const status = await wishlistService.getWishlistStatus(userId, postIdsArray);
    res.json(status);
  },
};
