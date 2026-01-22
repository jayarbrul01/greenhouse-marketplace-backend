import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/errors.js";

export const advertisementsService = {
  async createAdvertisement(input: {
    userId?: string;
    businessName: string;
    contactEmail: string;
    contactPhone?: string;
    bannerUrl: string;
    websiteUrl?: string;
    description?: string;
  }) {
    const advertisement = await prisma.advertisement.create({
      data: {
        userId: input.userId || null,
        businessName: input.businessName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone || null,
        bannerUrl: input.bannerUrl,
        websiteUrl: input.websiteUrl || null,
        description: input.description || null,
        status: "PENDING",
      },
    });

    return { advertisement };
  },

  async getActiveAdvertisements() {
    const now = new Date();
    const advertisements = await prisma.advertisement.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 active ads
    });

    return { advertisements };
  },

  async getAllAdvertisements(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [advertisements, total] = await Promise.all([
      prisma.advertisement.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      prisma.advertisement.count(),
    ]);

    return {
      advertisements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateAdvertisement(advertisementId: string, input: {
    status?: string;
    startDate?: string | null;
    endDate?: string | null;
  }) {
    const updateData: {
      status?: string;
      startDate?: Date | null;
      endDate?: Date | null;
    } = {};
    
    if (input.status !== undefined) {
      updateData.status = input.status;
    }
    if (input.startDate !== undefined) {
      updateData.startDate = input.startDate && input.startDate !== "" ? new Date(input.startDate) : null;
    }
    if (input.endDate !== undefined) {
      updateData.endDate = input.endDate && input.endDate !== "" ? new Date(input.endDate) : null;
    }

    const advertisement = await prisma.advertisement.update({
      where: { id: advertisementId },
      data: updateData,
    });

    return { advertisement };
  },

  async incrementViews(advertisementId: string) {
    await prisma.advertisement.update({
      where: { id: advertisementId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  },

  async incrementClicks(advertisementId: string) {
    await prisma.advertisement.update({
      where: { id: advertisementId },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  },
};
