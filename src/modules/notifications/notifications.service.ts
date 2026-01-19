import { prisma } from "../../config/prisma.js";
import { firebaseAdmin } from "../../config/firebase.js";

type UserWithFCMToken = {
  id: string;
  fcmToken: string | null;
};

export const notificationsService = {
  /**
   * Send push notification to all users when a new post is created
   */
  async sendNewPostNotification(post: {
    id: string;
    title: string;
    category?: string | null;
    userId: string;
  }) {
    try {
      // Get ALL users (not just those with FCM tokens)
      const allUsers: UserWithFCMToken[] = await prisma.user.findMany({
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
      const notificationPromises = allUsers.map((user) =>
        prisma.notification.create({
          data: {
            userId: user.id,
            title: "New Product Available!",
            message: `${post.title}${post.category ? ` - ${post.category}` : ""}`,
            read: false,
            postId: post.id,
          },
        })
      );

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
          tokens: usersWithFCMTokens.map((u) => u.fcmToken!).filter(Boolean) as string[],
        };

        // Send multicast message to users with FCM tokens
        fcmResponse = await firebaseAdmin.messaging().sendEachForMulticast(message);
        console.log(`Successfully sent FCM notifications: ${fcmResponse.successCount}, Failed: ${fcmResponse.failureCount}`);
      } else {
        console.log("No users with FCM tokens found, skipping push notifications");
      }

      // Logging is done above after Promise.all

      return {
        sent: fcmResponse.successCount,
        failed: fcmResponse.failureCount,
        inAppNotifications: allUsers.length,
      };
    } catch (error: any) {
      console.error("Error sending push notifications:", error);
      throw error;
    }
  },

  /**
   * Register or update FCM token for a user
   */
  async registerFCMToken(userId: string, fcmToken: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { fcmToken },
      });
      return { success: true };
    } catch (error: any) {
      console.error("Error registering FCM token:", error);
      throw error;
    }
  },

  /**
   * Remove FCM token for a user
   */
  async removeFCMToken(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { fcmToken: null },
      });
      return { success: true };
    } catch (error: any) {
      console.error("Error removing FCM token:", error);
      throw error;
    }
  },

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string) {
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
    } catch (error: any) {
      console.error("Error fetching unread notifications:", error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
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
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  /**
   * Get count of unread notifications for a user
   */
  async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });
      return count;
    } catch (error: any) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },
};
