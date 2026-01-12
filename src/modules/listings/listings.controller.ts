import type { Request, Response } from "express";
import { listingsService } from "./listings.service.js";

export const listingsController = {
  getListings: async (req: Request, res: Response) => {
    const { query } = (req as any).validated;
    const result = await listingsService.getListings(query);
    res.json(result);
  },
};
