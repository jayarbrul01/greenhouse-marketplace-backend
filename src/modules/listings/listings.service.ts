import { prisma } from "../../config/prisma.js";

type GetListingsParams = {
  q?: string;
  category?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

export const listingsService = {
  async getListings(params: GetListingsParams) {
    const {
      q,
      category,
      region,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "ACTIVE", // Only show active listings
    };

    // Keyword search (title or description)
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // Region filter
    if (region) {
      where.region = region;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Category filter (through ListingCategory relation)
    if (category) {
      where.categories = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    // Get total count
    const total = await prisma.listing.count({ where });

    // Get listings with pagination
    const listings = await prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        price: true,
        currency: true,
        region: true,
        description: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform listings to include category names
    const items = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      type: listing.type,
      category: listing.categories[0]?.category.name || null,
      price: listing.price,
      currency: listing.currency,
      region: listing.region,
      description: listing.description,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  },
};
