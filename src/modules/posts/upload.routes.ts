import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadController, uploadImage, uploadVideo } from "./upload.controller.js";

const r = Router();

// All routes require authentication and SELLER, BUYER, WISHLIST, or ADMIN role
r.use(requireAuth);
r.use(requireRole(["SELLER", "BUYER", "WISHLIST", "ADMIN"]));

// Upload image
r.post("/image", uploadImage.single("file"), uploadController.uploadImage);

// Upload video
r.post("/video", uploadVideo.single("file"), uploadController.uploadVideo);

export default r;
