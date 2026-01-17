type GetListingsParams = {
    q?: string;
    category?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
};
export declare const listingsService: {
    getListings(params: GetListingsParams): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
};
export {};
//# sourceMappingURL=listings.service.d.ts.map