import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
export declare const wishlistController: {
    addToWishlist(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeFromWishlist(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserWishlist(req: AuthedRequest, res: Response): Promise<void>;
    checkWishlistStatus(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=wishlist.controller.d.ts.map