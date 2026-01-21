import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";

export const wishlistService = {
  async addToWishlist(userId: string, postId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    // Check if user is trying to add their own product
    if (post.userId === userId) {
      throw new HttpError(400, "You cannot add your own products to your wishlist");
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

  async removeFromWishlist(userId: string, postId: string) {
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

  async getUserWishlist(userId: string, page: number = 1, limit: number = 12) {
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

    type WishlistItemWithPost = {
      post: {
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
      } | null;
    };

    return {
      items: items.map((item: WishlistItemWithPost) => item.post).filter(Boolean) as NonNullable<WishlistItemWithPost['post']>[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async checkIfInWishlist(userId: string, postId: string): Promise<boolean> {
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

  async getWishlistStatus(userId: string, postIds: string[]): Promise<Record<string, boolean>> {
    if (!postIds || postIds.length === 0) {
      return {};
    }

    // Initialize all postIds as false
    const statusMap: Record<string, boolean> = {};
    postIds.forEach((postId: string) => {
      statusMap[postId] = false;
    });

    try {
      const items: Array<{ postId: string | null }> = await prisma.wishlistItem.findMany({
        where: {
          userId,
          postId: { 
            in: postIds.filter(id => id && id.trim().length > 0) 
          },
        },
        select: {
          postId: true,
        },
      });

      items.forEach((item) => {
        if (item.postId && statusMap.hasOwnProperty(item.postId)) {
          statusMap[item.postId] = true;
        }
      });
    } catch (error: any) {
      // If there's a database error, log it but return the default false status
      console.error("Error fetching wishlist status:", error);
      // Return all false statuses as fallback
    }

    return statusMap;
  },
};
