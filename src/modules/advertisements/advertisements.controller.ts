import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { advertisementsService } from "./advertisements.service.js";

export const advertisementsController = {
  async createAdvertisement(req: AuthedRequest | any, res: Response) {
    try {
      const userId = req.user?.id || null;
      const { businessName, contactEmail, contactPhone, bannerUrl, websiteUrl, description } = req.body;

      const result = await advertisementsService.createAdvertisement({
        userId,
        businessName,
        contactEmail,
        contactPhone,
        bannerUrl,
        websiteUrl,
        description,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create advertisement" });
    }
  },

  async getActiveAdvertisements(req: any, res: Response) {
    try {
      const result = await advertisementsService.getActiveAdvertisements();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get advertisements" });
    }
  },

  async getAllAdvertisements(req: any, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await advertisementsService.getAllAdvertisements(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get advertisements" });
    }
  },

  async updateAdvertisement(req: AuthedRequest, res: Response) {
    try {
      const advertisementIdParam = req.params.id;
      if (!advertisementIdParam || Array.isArray(advertisementIdParam)) {
        return res.status(400).json({ message: "Advertisement ID is required" });
      }
      const advertisementId: string = advertisementIdParam;
      
      const { status, startDate, endDate } = req.body;

      const result = await advertisementsService.updateAdvertisement(advertisementId, {
        status,
        startDate,
        endDate,
      });

      res.json(result);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.status(500).json({ message: error.message || "Failed to update advertisement" });
    }
  },

  async trackView(req: any, res: Response) {
    try {
      const advertisementIdParam = req.params.id;
      if (!advertisementIdParam || Array.isArray(advertisementIdParam)) {
        return res.status(400).json({ message: "Advertisement ID is required" });
      }
      const advertisementId: string = advertisementIdParam;
      
      await advertisementsService.incrementViews(advertisementId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to track view" });
    }
  },

  async trackClick(req: any, res: Response) {
    try {
      const advertisementIdParam = req.params.id;
      if (!advertisementIdParam || Array.isArray(advertisementIdParam)) {
        return res.status(400).json({ message: "Advertisement ID is required" });
      }
      const advertisementId: string = advertisementIdParam;
      
      await advertisementsService.incrementClicks(advertisementId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to track click" });
    }
  },
};
