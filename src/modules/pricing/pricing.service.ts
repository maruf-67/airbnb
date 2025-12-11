import Pricing from './pricing.model.js';
import Post from '../posts/post.model.js';
import { AppError } from '../../common/utils/AppError.js';

export class PricingService {
    async createPricing(data: any, userId: string, isAdmin: boolean) {
        // Check post ownership logic
        const post = await Post.findById(data.postId);
        if (!post) {
            throw new AppError('Post not found', 404);
        }

        if (post.owner.toString() !== userId && !isAdmin) {
            throw new AppError('Not authorized to set pricing for this post', 403);
        }

        const pricing = await Pricing.create(data);
        return pricing;
    }

    async getPricingByPost(postId: string) {
        return await Pricing.find({ post: postId, isActive: true });
    }

    async updatePricing(id: string, data: any, userId: string, isAdmin: boolean) {
        const pricing = await Pricing.findById(id).populate('post');
        if (!pricing) {
            throw new AppError('Pricing rule not found', 404);
        }

        const post = pricing.post as any;
        if (post.owner.toString() !== userId && !isAdmin) {
            throw new AppError('Not authorized to update this pricing', 403);
        }

        Object.assign(pricing, data);
        await pricing.save();
        return pricing;
    }
}

export const pricingService = new PricingService();
