export declare const notificationsService: {
    /**
     * Send push notification to all users when a new post is created
     */
    sendNewPostNotification(post: {
        id: string;
        title: string;
        category?: string | null;
        userId: string;
    }): Promise<{
        sent: number;
        failed: number;
        inAppNotifications?: never;
    } | {
        sent: number;
        failed: number;
        inAppNotifications: number;
    }>;
    /**
     * Register or update FCM token for a user
     */
    registerFCMToken(userId: string, fcmToken: string): Promise<{
        success: boolean;
    }>;
    /**
     * Remove FCM token for a user
     */
    removeFCMToken(userId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get unread notifications for a user
     */
    getUnreadNotifications(userId: string): Promise<any>;
    /**
     * Mark a notification as read
     */
    markAsRead(userId: string, notificationId: string): Promise<any>;
    /**
     * Get count of unread notifications for a user
     */
    getUnreadCount(userId: string): Promise<any>;
    /**
     * Send notification to users who have a post in their wishlist when the post is updated
     */
    sendPostUpdateNotification(post: {
        id: string;
        title: string;
        category?: string | null;
    }): Promise<{
        sent: number;
        failed: number;
        inAppNotifications: number;
    }>;
    /**
     * Send notification to users who have a post in their wishlist when the post is deleted
     */
    sendPostDeleteNotification(post: {
        id: string;
        title: string;
        category?: string | null;
    }): Promise<{
        sent: number;
        failed: number;
        inAppNotifications: number;
    }>;
};
//# sourceMappingURL=notifications.service.d.ts.map