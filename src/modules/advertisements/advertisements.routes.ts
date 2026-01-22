import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { advertisementsController } from "./advertisements.controller.js";
import { CreateAdvertisementSchema, UpdateAdvertisementSchema } from "./advertisements.validation.js";

const r = Router();

// Public routes
r.post("/", validate(CreateAdvertisementSchema), advertisementsController.createAdvertisement);
r.get("/active", advertisementsController.getActiveAdvertisements);
r.post("/:id/view", advertisementsController.trackView);
r.post("/:id/click", advertisementsController.trackClick);

// Protected routes (admin only - can be added later)
r.get("/", requireAuth, advertisementsController.getAllAdvertisements);
r.patch("/:id", requireAuth, validate(UpdateAdvertisementSchema), advertisementsController.updateAdvertisement);

export default r;
