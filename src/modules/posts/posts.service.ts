import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";
import { notificationsService } from "../notifications/notifications.service.js";

async function getUserRoles(userId: string) {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return roles.map((r: { role: { name: string } }) => r.role.name);
}

export const postsService = {
  async createPost(input: {
    userId: string;
    title: string;
    information?: string;
    price?: number;
    region?: string;
    category?: string;
    image?: string;
    video?: string;
  }) {
    // Check if user has SELLER role
    const userRoles = await getUserRoles(input.userId);
    if (!userRoles.includes("SELLER")) {
      throw new HttpError(403, "Only users with SELLER role can create posts");
    }

    // Create post in database using Prisma
    const post = await prisma.post.create({
      data: {
        userId: input.userId,
        title: input.title,
        information: input.information || null,
        price: input.price || null,
        region: input.region || null,
        category: input.category || null,
        image: input.image || null,
        video: input.video || null,
      },
    });

    // Send push notification to all users (fire and forget - don't wait for it)
    notificationsService.sendNewPostNotification({
      id: post.id,
      title: post.title,
      category: post.category,
      userId: post.userId,
    }).catch((error) => {
      console.error("Failed to send push notifications:", error);
      // Don't throw - notification failure shouldn't break post creation
    });

    return { post };
  },

  async getUserPosts(userId: string, options?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    // Build where clause - ALWAYS filter by userId to ensure users only see their own posts
    const where: any = {
      userId: userId, // Filter by user ID to show only user's own posts
    };
    
    if (options?.search) {
      const searchTerm = options.search.trim();
      where.AND = [
        {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { information: { contains: searchTerm, mode: "insensitive" } },
            { category: { contains: searchTerm, mode: "insensitive" } },
            { region: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      ];
    }

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const skip = (page - 1) * limit;

    // Get posts and total count - only for this user
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getPostsByUserId(userId: string, options?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {
      userId: userId,
    };
    
    if (options?.search) {
      const searchTerm = options.search.trim();
      where.AND = [
        {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { information: { contains: searchTerm, mode: "insensitive" } },
            { category: { contains: searchTerm, mode: "insensitive" } },
            { region: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      ];
    }

    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getAllPosts(options?: {
    search?: string;
    category?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    // Build where clause for filters
    const where: any = {};
    
    if (options?.search) {
      const searchTerm = options.search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { information: { contains: searchTerm, mode: "insensitive" } },
        { category: { contains: searchTerm, mode: "insensitive" } },
        { region: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (options?.category) {
      where.category = options.category;
    }

    if (options?.region) {
      // Support multiple regions (comma-separated or array)
      const regions = Array.isArray(options.region) 
        ? options.region 
        : options.region.split(',').map(r => r.trim()).filter(r => r);
      
      if (regions.length > 0) {
        where.region = {
          in: regions,
        };
      }
    }

    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      where.price = {};
      if (options?.minPrice !== undefined) {
        where.price.gte = options.minPrice;
      }
      if (options?.maxPrice !== undefined) {
        where.price.lte = options.maxPrice;
      }
    }

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const skip = (page - 1) * limit;

    // Get posts and total count
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getPost(postId: string, userId?: string) {
    // Get a single post (public access)
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            phoneVerified: true,
            emailVerified: true,
            createdAt: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    return { post };
  },

  async updatePost(postId: string, userId: string, input: {
    title?: string;
    information?: string;
    price?: number;
    region?: string;
    category?: string;
    image?: string;
    video?: string;
  }) {
    // Check if user has SELLER role
    const userRoles = await getUserRoles(userId);
    if (!userRoles.includes("SELLER")) {
      throw new HttpError(403, "Only users with SELLER role can update posts");
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new HttpError(404, "Post not found");
    }

    if (existingPost.userId !== userId) {
      throw new HttpError(403, "You can only update your own posts");
    }

    // Update post in database
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.information !== undefined && { information: input.information }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.region !== undefined && { region: input.region }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.image !== undefined && { image: input.image }),
        ...(input.video !== undefined && { video: input.video }),
      },
    });

    return { post };
  },

  async deletePost(postId: string, userId: string) {
    // Check if user has SELLER role
    const userRoles = await getUserRoles(userId);
    if (!userRoles.includes("SELLER")) {
      throw new HttpError(403, "Only users with SELLER role can delete posts");
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new HttpError(404, "Post not found");
    }

    if (existingPost.userId !== userId) {
      throw new HttpError(403, "You can only delete your own posts");
    }

    // Delete post from database
    await prisma.post.delete({
      where: { id: postId },
    });

    return { success: true };
  },
};
