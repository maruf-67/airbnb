import Post from './post.model.js';
import { AppError } from '../../common/utils/AppError.js';

export class PostService {
    async createPost(data: any, userId: string) {
        const post = await Post.create({
            ...data,
            owner: userId
        });
        return post;
    }

    async getAllPosts(query: any, isAdmin: boolean = false) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};

        // Publishing logic
        if (!isAdmin) {
            filter.isPublished = true;
        } else {
            if (query.isPublished !== undefined) {
                filter.isPublished = query.isPublished === 'true';
            }
        }

        // Search logic
        if (query.search) {
            const searchRegex = { $regex: query.search, $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { location: searchRegex },
                // Description might be too heavy for regex search on every request, keeping it to title/location for admin consistency
                // If strictly text search is preferred: filter.$text = { $search: query.search };
            ];
        }

        if (query.location) {
            filter.location = { $regex: query.location, $options: 'i' };
        }

        if (query.minPrice || query.maxPrice) {
            filter.price = {};
            if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
            if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
        }

        // Search logic for specific fields can override generic search if needed

        // Sorting
        const sort: any = {};
        if (query.sort) {
            const order = query.order === 'asc' ? 1 : -1;
            sort[query.sort] = order;
        } else {
            sort.createdAt = -1;
        }

        const posts = await Post.find(filter)
            .populate('owner', 'name avatar')
            .skip(skip)
            .limit(limit)
            .sort(sort);

        const total = await Post.countDocuments(filter);

        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getPostById(id: string) {
        const post = await Post.findById(id).populate('owner', 'name avatar email phone');
        if (!post) {
            throw new AppError('Post not found', 404);
        }
        return post;
    }

    async updatePost(id: string, data: any, userId: string, isAdmin: boolean) {
        const post = await Post.findById(id);
        if (!post) {
            throw new AppError('Post not found', 404);
        }

        // Check ownership unless admin
        if (post.owner.toString() !== userId && !isAdmin) {
            throw new AppError('You do not have permission to update this post', 403);
        }

        Object.assign(post, data);
        await post.save();
        return post;
    }

    async deletePost(id: string, userId: string, isAdmin: boolean) {
        const post = await Post.findById(id);
        if (!post) {
            throw new AppError('Post not found', 404);
        }

        if (post.owner.toString() !== userId && !isAdmin) {
            throw new AppError('You do not have permission to delete this post', 403);
        }

        await post.deleteOne();
        return true;
    }
}

export const postService = new PostService();
