import { listingsService } from "./listings.service.js";
export const listingsController = {
    getListings: async (req, res) => {
        const { query } = req.validated;
        const result = await listingsService.getListings(query);
        res.json(result);
    },
};
//# sourceMappingURL=listings.controller.js.map