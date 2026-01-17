import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
export declare const usersController: {
    me: (req: AuthedRequest, res: Response) => Promise<void>;
    updateMe: (req: AuthedRequest, res: Response) => Promise<void>;
    updatePrefs: (req: AuthedRequest, res: Response) => Promise<void>;
    updateRoles: (req: AuthedRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=users.controller.d.ts.map