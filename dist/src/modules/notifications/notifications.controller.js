import { notificationsService } from "./notifications.service.js";
export const notificationsController = {
    async registerFCMToken(req, res) {
        const userId = req.user.id;
        const { fcmToken } = req.body;
        if (!fcmToken) {
            return res.status(400).json({ message: "FCM token is required" });
        }
        await notificationsService.registerFCMToken(userId, fcmToken);
        res.json({ message: "FCM token registered successfully" });
    },
    async removeFCMToken(req, res) {
        const userId = req.user.id;
        await notificationsService.removeFCMToken(userId);
        res.json({ message: "FCM token removed successfully" });
    },
    async getUnreadNotifications(req, res) {
        const userId = req.user.id;
        const notifications = await notificationsService.getUnreadNotifications(userId);
        res.json({ notifications });
    },
    async markAsRead(req, res) {
        const userId = req.user.id;
        const notificationId = req.params.notificationId;
        if (!notificationId || Array.isArray(notificationId)) {
            return res.status(400).json({ message: "Invalid notification ID" });
        }
        // TypeScript now knows notificationId is a string after the check
        const notification = await notificationsService.markAsRead(userId, notificationId);
        res.json({ notification });
    },
    async getUnreadCount(req, res) {
        const userId = req.user.id;
        const count = await notificationsService.getUnreadCount(userId);
        res.json({ count });
    },
};
//# sourceMappingURL=notifications.controller.js.map