import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import multer from "multer";
export declare const upload: multer.Multer;
export declare const uploadController: {
    uploadImage(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    uploadVideo(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=upload.controller.d.ts.map