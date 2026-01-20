import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { wishlistController } from "./wishlist.controller.js";
import { AddToWishlistSchema, RemoveFromWishlistSchema, GetWishlistSchema } from "./wishlist.validation.js";
const r = Router();
// All routes require authentication
r.use(requireAuth);
// Add post to wishlist
r.post("/", validate(AddToWishlistSchema), wishlistController.addToWishlist);
// Remove post from wishlist
r.delete("/:postId", validate(RemoveFromWishlistSchema), wishlistController.removeFromWishlist);
// Get user's wishlist
r.get("/", validate(GetWishlistSchema), wishlistController.getUserWishlist);
// Check wishlist status for multiple posts
r.get("/status", wishlistController.checkWishlistStatus);
export default r;
//# sourceMappingURL=wishlist.routes.js.map