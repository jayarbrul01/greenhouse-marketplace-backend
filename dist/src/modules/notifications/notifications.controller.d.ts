import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
export declare const notificationsController: {
    registerFCMToken(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeFCMToken(req: AuthedRequest, res: Response): Promise<void>;
    getUnreadNotifications(req: AuthedRequest, res: Response): Promise<void>;
    markAsRead(req: AuthedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUnreadCount(req: AuthedRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=notifications.controller.d.ts.map