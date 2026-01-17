import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
export declare const authController: {
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    refresh: (req: Request, res: Response) => Promise<void>;
    verifyEmail: (req: AuthedRequest, res: Response) => Promise<void>;
    verifyPhone: (req: AuthedRequest, res: Response) => Promise<void>;
    checkFirebaseEmailVerification: (req: Request, res: Response) => Promise<void>;
    checkFirebasePhoneVerification: (req: Request, res: Response) => Promise<void>;
    googleAuth: (req: Request, res: Response) => Promise<void>;
    firebaseAuth: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map