import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
export declare const postsController: {
    createPost(req: AuthedRequest, res: Response): Promise<void>;
    getUserPosts(req: AuthedRequest, res: Response): Promise<void>;
    getAllPosts(req: Request, res: Response): Promise<void>;
    getPost(req: Request, res: Response): Promise<void>;
    updatePost(req: AuthedRequest, res: Response): Promise<void>;
    deletePost(req: AuthedRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=posts.controller.d.ts.map