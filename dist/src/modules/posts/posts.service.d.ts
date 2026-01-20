export declare const postsService: {
    createPost(input: {
        userId: string;
        title: string;
        information?: string;
        price?: number;
        region?: string;
        category?: string;
        image?: string;
        video?: string;
    }): Promise<{
        post: any;
    }>;
    getUserPosts(userId: string, options?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        posts: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPostsByUserId(userId: string, options?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        posts: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllPosts(options?: {
        search?: string;
        category?: string;
        region?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        posts: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPost(postId: string, userId?: string): Promise<{
        post: any;
    }>;
    updatePost(postId: string, userId: string, input: {
        title?: string;
        information?: string;
        price?: number;
        region?: string;
        category?: string;
        image?: string;
        video?: string;
    }): Promise<{
        post: any;
    }>;
    deletePost(postId: string, userId: string): Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=posts.service.d.ts.map