import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { notificationsController } from "./notifications.controller.js";
import { RegisterFCMTokenSchema } from "./notifications.validation.js";
const r = Router();
// Register FCM token - requires authentication
r.post("/fcm-token", requireAuth, validate(RegisterFCMTokenSchema), notificationsController.registerFCMToken);
// Remove FCM token - requires authentication
r.delete("/fcm-token", requireAuth, notificationsController.removeFCMToken);
// Get unread notifications - requires authentication
r.get("/unread", requireAuth, notificationsController.getUnreadNotifications);
// Get unread count - requires authentication
r.get("/unread/count", requireAuth, notificationsController.getUnreadCount);
// Mark notification as read - requires authentication
r.patch("/:notificationId/read", requireAuth, notificationsController.markAsRead);
export { r as notificationsRoutes };
//# sourceMappingURL=notifications.routes.js.map