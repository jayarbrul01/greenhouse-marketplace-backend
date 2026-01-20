export declare const wishlistService: {
    addToWishlist(userId: string, postId: string): Promise<any>;
    removeFromWishlist(userId: string, postId: string): Promise<{
        success: boolean;
    }>;
    getUserWishlist(userId: string, page?: number, limit?: number): Promise<{
        items: NonNullable<{
            id: string;
            userId: string;
            title: string;
            information: string | null;
            price: number | null;
            region: string | null;
            category: string | null;
            image: string | null;
            video: string | null;
            createdAt: Date;
            updatedAt: Date;
            user: {
                id: string;
                fullName: string | null;
                email: string;
                avatar: string | null;
            } | null;
        } | null>[];
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    checkIfInWishlist(userId: string, postId: string): Promise<boolean>;
    getWishlistStatus(userId: string, postIds: string[]): Promise<Record<string, boolean>>;
};
//# sourceMappingURL=wishlist.service.d.ts.map