import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { postsController } from "./posts.controller.js";
import { CreatePostSchema, UpdatePostSchema } from "./posts.validation.js";
const r = Router();
// Public routes (no auth required) - must be before authenticated routes
r.get("/all", postsController.getAllPosts);
r.get("/user/:userId", postsController.getPostsByUserId);
r.get("/:id", postsController.getPost);
// All other routes require authentication
r.use(requireAuth);
// Create post - only SELLER role
r.post("/", requireRole(["SELLER"]), validate(CreatePostSchema), postsController.createPost);
// Get user's posts
r.get("/", postsController.getUserPosts);
// Update post - only SELLER role
r.put("/:id", requireRole(["SELLER"]), validate(UpdatePostSchema), postsController.updatePost);
// Delete post - only SELLER role
r.delete("/:id", requireRole(["SELLER"]), postsController.deletePost);
export default r;
//# sourceMappingURL=posts.routes.js.map