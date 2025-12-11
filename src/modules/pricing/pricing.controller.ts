import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import { pricingService } from './pricing.service.js';

export const createPricing = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const isAdmin = user.role && user.role.type === 'admin';
    const pricing = await pricingService.createPricing(req.body, user._id, isAdmin);
    sendSuccess(res, pricing, 'Pricing rule created successfully', 201);
});

export const getPostPricing = catchAsync(async (req: Request, res: Response) => {
    const pricing = await pricingService.getPricingByPost(req.params.postId as string);
    sendSuccess(res, pricing, 'Pricing rules retrieved successfully');
});

export const updatePricing = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const isAdmin = user.role && user.role.type === 'admin';
    const pricing = await pricingService.updatePricing(req.params.id as string, req.body, user._id, isAdmin);
    sendSuccess(res, pricing, 'Pricing rule updated successfully');
});
