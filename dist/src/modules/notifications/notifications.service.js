import { prisma } from "../../config/prisma.js";
import { firebaseAdmin } from "../../config/firebase.js";
export const notificationsService = {
    /**
     * Send push notification to all users when a new post is created
     */
    async sendNewPostNotification(post) {
        try {
            // Get ALL users (not just those with FCM tokens)
            const allUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    fcmToken: true,
                },
            });
            if (allUsers.length === 0) {
                console.log("No users found");
                return { sent: 0, failed: 0 };
            }
            // Filter users with FCM tokens for push notifications
            const usersWithFCMTokens = allUsers.filter((u) => u.fcmToken);
            // Create in-app notifications for ALL users (regardless of FCM token)
            console.log(`[Notification Service] Creating notifications for ${allUsers.length} users for post: ${post.id}`);
            const notificationPromises = allUsers.map((user) => prisma.notification.create({
                data: {
                    userId: user.id,
                    title: "New Product Available!",
                    message: `${post.title}${post.category ? ` - ${post.category}` : ""}`,
                    read: false,
                    postId: post.id,
                },
            }));
            const createdNotifications = await Promise.all(notificationPromises);
            console.log(`[Notification Service] Successfully created ${createdNotifications.length} in-app notifications`);
            // Send FCM push notifications only to users with FCM tokens
            let fcmResponse = { successCount: 0, failureCount: 0 };
            if (usersWithFCMTokens.length > 0) {
                const message = {
                    notification: {
                        title: "New Product Available!",
                        body: `${post.title}${post.category ? ` - ${post.category}` : ""}`,
                    },
                    data: {
                        type: "new_post",
                        postId: post.id,
                        category: post.category || "",
                    },
                    tokens: usersWithFCMTokens.map((u) => u.fcmToken).filter(Boolean),
                };
                // Send multicast message to users with FCM tokens
                fcmResponse = await firebaseAdmin.messaging().sendEachForMulticast(message);
                console.log(`Successfully sent FCM notifications: ${fcmResponse.successCount}, Failed: ${fcmResponse.failureCount}`);
            }
            else {
                console.log("No users with FCM tokens found, skipping push notifications");
            }
            // Logging is done above after Promise.all
            return {
                sent: fcmResponse.successCount,
                failed: fcmResponse.failureCount,
                inAppNotifications: allUsers.length,
            };
        }
        catch (error) {
            console.error("Error sending push notifications:", error);
            throw error;
        }
    },
    /**
     * Register or update FCM token for a user
     */
    async registerFCMToken(userId, fcmToken) {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { fcmToken },
            });
            return { success: true };
        }
        catch (error) {
            console.error("Error registering FCM token:", error);
            throw error;
        }
    },
    /**
     * Remove FCM token for a user
     */
    async removeFCMToken(userId) {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { fcmToken: null },
            });
            return { success: true };
        }
        catch (error) {
            console.error("Error removing FCM token:", error);
            throw error;
        }
    },
    /**
     * Get unread notifications for a user
     */
    async getUnreadNotifications(userId) {
        try {
            const notifications = await prisma.notification.findMany({
                where: {
                    userId,
                    read: false,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 50, // Limit to 50 most recent
            });
            return notifications;
        }
        catch (error) {
            console.error("Error fetching unread notifications:", error);
            throw error;
        }
    },
    /**
     * Mark a notification as read
     */
    async markAsRead(userId, notificationId) {
        try {
            const notification = await prisma.notification.update({
                where: {
                    id: notificationId,
                    userId, // Ensure user can only mark their own notifications as read
                },
                data: {
                    read: true,
                },
            });
            return notification;
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    },
    /**
     * Get count of unread notifications for a user
     */
    async getUnreadCount(userId) {
        try {
            const count = await prisma.notification.count({
                where: {
                    userId,
                    read: false,
                },
            });
            return count;
        }
        catch (error) {
            console.error("Error fetching unread count:", error);
            throw error;
        }
    },
    /**
     * Send notification to users who have a post in their wishlist when the post is updated
     */
    async sendPostUpdateNotification(post) {
        try {
            // Get all users who have this post in their wishlist
            const wishlistItems = await prisma.wishlistItem.findMany({
                where: {
                    postId: post.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fcmToken: true,
                        },
                    },
                },
            });
            if (wishlistItems.length === 0) {
                console.log(`[Notification Service] No users have post ${post.id} in their wishlist`);
                return { sent: 0, failed: 0, inAppNotifications: 0 };
            }
            const users = wishlistItems.map((item) => item.user);
            const usersWithFCMTokens = users.filter((u) => u.fcmToken);
            // Create in-app notifications for all users who have this post in wishlist
            console.log(`[Notification Service] Creating update notifications for ${users.length} users for post: ${post.id}`);
            const notificationPromises = users.map((user) => prisma.notification.create({
                data: {
                    userId: user.id,
                    title: "Product Updated!",
                    message: `${post.title}${post.category ? ` - ${post.category}` : ""} has been updated`,
                    read: false,
                    postId: post.id,
                },
            }));
            const createdNotifications = await Promise.all(notificationPromises);
            console.log(`[Notification Service] Successfully created ${createdNotifications.length} in-app notifications for post update`);
            // Send FCM push notifications only to users with FCM tokens
            let fcmResponse = { successCount: 0, failureCount: 0 };
            if (usersWithFCMTokens.length > 0) {
                const message = {
                    notification: {
                        title: "Product Updated!",
                        body: `${post.title}${post.category ? ` - ${post.category}` : ""} has been updated`,
                    },
                    data: {
                        type: "post_updated",
                        postId: post.id,
                        category: post.category || "",
                    },
                    tokens: usersWithFCMTokens.map((u) => u.fcmToken).filter(Boolean),
                };
                // Send multicast message to users with FCM tokens
                fcmResponse = await firebaseAdmin.messaging().sendEachForMulticast(message);
                console.log(`Successfully sent FCM notifications for post update: ${fcmResponse.successCount}, Failed: ${fcmResponse.failureCount}`);
            }
            else {
                console.log("No users with FCM tokens found, skipping push notifications for post update");
            }
            return {
                sent: fcmResponse.successCount,
                failed: fcmResponse.failureCount,
                inAppNotifications: users.length,
            };
        }
        catch (error) {
            console.error("Error sending post update notifications:", error);
            throw error;
        }
    },
    /**
     * Send notification to users who have a post in their wishlist when the post is deleted
     */
    async sendPostDeleteNotification(post) {
        try {
            // Get all users who have this post in their wishlist
            const wishlistItems = await prisma.wishlistItem.findMany({
                where: {
                    postId: post.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fcmToken: true,
                        },
                    },
                },
            });
            if (wishlistItems.length === 0) {
                console.log(`[Notification Service] No users have post ${post.id} in their wishlist`);
                return { sent: 0, failed: 0, inAppNotifications: 0 };
            }
            const users = wishlistItems.map((item) => item.user);
            const usersWithFCMTokens = users.filter((u) => u.fcmToken);
            // Create in-app notifications for all users who have this post in wishlist
            console.log(`[Notification Service] Creating delete notifications for ${users.length} users for post: ${post.id}`);
            const notificationPromises = users.map((user) => prisma.notification.create({
                data: {
                    userId: user.id,
                    title: "Product Removed",
                    message: `${post.title}${post.category ? ` - ${post.category}` : ""} has been removed`,
                    read: false,
                    // Don't include postId since the post no longer exists
                    postId: null,
                },
            }));
            const createdNotifications = await Promise.all(notificationPromises);
            console.log(`[Notification Service] Successfully created ${createdNotifications.length} in-app notifications for post deletion`);
            // Send FCM push notifications only to users with FCM tokens
            let fcmResponse = { successCount: 0, failureCount: 0 };
            if (usersWithFCMTokens.length > 0) {
                const message = {
                    notification: {
                        title: "Product Removed",
                        body: `${post.title}${post.category ? ` - ${post.category}` : ""} has been removed`,
                    },
                    data: {
                        type: "post_deleted",
                        postId: post.id,
                        category: post.category || "",
                    },
                    tokens: usersWithFCMTokens.map((u) => u.fcmToken).filter(Boolean),
                };
                // Send multicast message to users with FCM tokens
                fcmResponse = await firebaseAdmin.messaging().sendEachForMulticast(message);
                console.log(`Successfully sent FCM notifications for post deletion: ${fcmResponse.successCount}, Failed: ${fcmResponse.failureCount}`);
            }
            else {
                console.log("No users with FCM tokens found, skipping push notifications for post deletion");
            }
            return {
                sent: fcmResponse.successCount,
                failed: fcmResponse.failureCount,
                inAppNotifications: users.length,
            };
        }
        catch (error) {
            console.error("Error sending post delete notifications:", error);
            throw error;
        }
    },
};
//# sourceMappingURL=notifications.service.js.map