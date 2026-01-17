import { postsService } from "./posts.service.js";
export const postsController = {
    async createPost(req, res) {
        const userId = req.user.id;
        const result = await postsService.createPost({
            userId,
            ...req.body,
        });
        res.status(201).json(result);
    },
    async getUserPosts(req, res) {
        const userId = req.user.id;
        const search = req.query.q;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
        const options = {
            page,
            limit,
        };
        if (search) {
            options.search = search;
        }
        const result = await postsService.getUserPosts(userId, options);
        res.json(result);
    },
    async getAllPosts(req, res) {
        const search = req.query.q;
        const category = req.query.category;
        const region = req.query.region;
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
        const options = {
            page,
            limit,
        };
        if (search)
            options.search = search;
        if (category)
            options.category = category;
        if (region)
            options.region = region;
        if (minPrice !== undefined && !isNaN(minPrice))
            options.minPrice = minPrice;
        if (maxPrice !== undefined && !isNaN(maxPrice))
            options.maxPrice = maxPrice;
        const result = await postsService.getAllPosts(options);
        res.json(result);
    },
    async getPost(req, res) {
        const postId = req.params.id;
        const result = await postsService.getPost(postId, "");
        res.json(result);
    },
    async updatePost(req, res) {
        const userId = req.user.id;
        const postId = req.params.id;
        const result = await postsService.updatePost(postId, userId, req.body);
        res.json(result);
    },
    async deletePost(req, res) {
        const userId = req.user.id;
        const postId = req.params.id;
        const result = await postsService.deletePost(postId, userId);
        res.json(result);
    },
};
//# sourceMappingURL=posts.controller.js.map