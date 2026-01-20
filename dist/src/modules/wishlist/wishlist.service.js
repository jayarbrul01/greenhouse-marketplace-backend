import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";
export const wishlistService = {
    async addToWishlist(userId, postId) {
        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new HttpError(404, "Post not found");
        }
        // Check if already in wishlist
        const existing = await prisma.wishlistItem.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        if (existing) {
            throw new HttpError(400, "Post is already in wishlist");
        }
        // Add to wishlist
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId,
                postId,
            },
            include: {
                post: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        return wishlistItem;
    },
    async removeFromWishlist(userId, postId) {
        // Check if item exists
        const wishlistItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        if (!wishlistItem) {
            throw new HttpError(404, "Item not found in wishlist");
        }
        // Remove from wishlist
        await prisma.wishlistItem.delete({
            where: {
                id: wishlistItem.id,
            },
        });
        return { success: true };
    },
    async getUserWishlist(userId, page = 1, limit = 12) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            prisma.wishlistItem.findMany({
                where: {
                    userId,
                    postId: { not: null }, // Only get post-based wishlist items
                },
                include: {
                    post: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.wishlistItem.count({
                where: {
                    userId,
                    postId: { not: null },
                },
            }),
        ]);
        return {
            items: items.map((item) => item.post).filter(Boolean),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async checkIfInWishlist(userId, postId) {
        const item = await prisma.wishlistItem.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        return !!item;
    },
    async getWishlistStatus(userId, postIds) {
        const items = await prisma.wishlistItem.findMany({
            where: {
                userId,
                postId: { in: postIds },
            },
            select: {
                postId: true,
            },
        });
        const statusMap = {};
        postIds.forEach((postId) => {
            statusMap[postId] = false;
        });
        items.forEach((item) => {
            if (item.postId) {
                statusMap[item.postId] = true;
            }
        });
        return statusMap;
    },
};
//# sourceMappingURL=wishlist.service.js.map