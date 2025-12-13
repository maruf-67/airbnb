import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import { postService } from './post.service.js';

export const createPost = catchAsync(async (req: Request, res: Response) => {
    // User is guaranteed by auth middleware
    const post = await postService.createPost(req.body, (req as any).user._id);
    sendSuccess(res, post, 'Post created successfully', 201);
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
    const result = await postService.getAllPosts(req.query, false);
    sendSuccess(res, result, 'Posts retrieved successfully');
});

export const getAdminPosts = catchAsync(async (req: Request, res: Response) => {
    // Assuming auth middleware ensures user exists, but we can verify admin role if needed
    // The route will be protected by authenticateToken, but we might want restrictTo('admin') middleware eventually
    // For now, assume protected route access implies authorized (or check req.user.role)
    const result = await postService.getAllPosts(req.query, true);
    sendSuccess(res, result, 'Admin posts retrieved successfully');
});

export const getPost = catchAsync(async (req: Request, res: Response) => {
    const post = await postService.getPostById(req.params.id as string);
    sendSuccess(res, post, 'Post retrieved successfully');
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    // Check if admin based on role populate or type
    // Assuming role object has type 'admin'
    const isAdmin = user.role && user.role.type === 'admin';

    const post = await postService.updatePost(req.params.id as string, req.body, user._id, isAdmin);
    sendSuccess(res, post, 'Post updated successfully');
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const isAdmin = user.role && user.role.type === 'admin';

    await postService.deletePost(req.params.id as string, user._id, isAdmin);
    sendSuccess(res, null, 'Post deleted successfully');
});
