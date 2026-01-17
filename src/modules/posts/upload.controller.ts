import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { uploadService } from "./upload.service.js";
import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const uploadController = {
  async uploadImage(req: AuthedRequest, res: Response) {
    console.log("=== uploadImage called ===");
    console.log("Request received");
    console.log("User ID:", req.user?.id);
    console.log("User roles:", req.user?.roles);
    console.log("File present:", !!req.file);
    
    if (!req.file) {
      console.log("ERROR: No file provided in request");
      return res.status(400).json({ error: "No file provided" });
    }

    console.log("File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    });

    const userId = req.user!.id;
    console.log("Calling uploadService.uploadImage with userId:", userId);
    
    try {
      const result = await uploadService.uploadImage(
        req.file.buffer,
        req.file.originalname,
        userId
      );
      console.log("Upload successful, result:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Upload service error:", error);
      throw error;
    }
  },

  async uploadVideo(req: AuthedRequest, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const userId = req.user!.id;
    const result = await uploadService.uploadVideo(
      req.file.buffer,
      req.file.originalname,
      userId
    );
    res.json(result);
  },
};
