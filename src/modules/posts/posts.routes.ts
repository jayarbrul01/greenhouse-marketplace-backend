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

// Create post - SELLER or ADMIN role
r.post("/", requireRole(["SELLER", "ADMIN"]), validate(CreatePostSchema), postsController.createPost);

// Get user's posts
r.get("/", postsController.getUserPosts);

// Update post - SELLER or ADMIN role
r.put("/:id", requireRole(["SELLER", "ADMIN"]), validate(UpdatePostSchema), postsController.updatePost);

// Delete post - SELLER or ADMIN role
r.delete("/:id", requireRole(["SELLER", "ADMIN"]), postsController.deletePost);

export default r;
