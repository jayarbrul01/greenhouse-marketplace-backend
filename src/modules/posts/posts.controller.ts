import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { postsService } from "./posts.service.js";

export const postsController = {
  async createPost(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const result = await postsService.createPost({
      userId,
      ...req.body,
    });
    res.status(201).json(result);
  },

  async getUserPosts(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const search = req.query.q as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
    
    const options: {
      search?: string;
      page?: number;
      limit?: number;
    } = {
      page,
      limit,
    };
    
    if (search) {
      options.search = search;
    }
    
    const result = await postsService.getUserPosts(userId, options);
    res.json(result);
  },

  async getAllPosts(req: Request, res: Response) {
    const search = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const region = req.query.region as string | undefined;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
    
    const options: {
      search?: string;
      category?: string;
      region?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    } = {
      page,
      limit,
    };
    
    if (search) options.search = search;
    if (category) options.category = category;
    if (region) options.region = region;
    if (minPrice !== undefined && !isNaN(minPrice)) options.minPrice = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice)) options.maxPrice = maxPrice;
    
    const result = await postsService.getAllPosts(options);
    res.json(result);
  },

  async getPost(req: Request, res: Response) {
    const postId = req.params.id as string;
    const result = await postsService.getPost(postId, "");
    res.json(result);
  },

  async getPostsByUserId(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const search = req.query.q as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
    
    const options: {
      search?: string;
      page?: number;
      limit?: number;
    } = {
      page,
      limit,
    };
    
    if (search) {
      options.search = search;
    }
    
    const result = await postsService.getPostsByUserId(userId, options);
    res.json(result);
  },

  async updatePost(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const result = await postsService.updatePost(postId, userId, req.body);
    res.json(result);
  },

  async deletePost(req: AuthedRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const result = await postsService.deletePost(postId, userId);
    res.json(result);
  },
};
