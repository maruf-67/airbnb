import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createPricingSchema = z.object({
    body: z.object({
        postId: z.string(), // Link to a post
        type: z.enum(['base', 'cleaning_fee', 'weekend_adjustment', 'seasonal', 'service_fee']),
        amount: z.number(),
        currency: z.string().default('USD'),
        startDate: z.string().optional(), // For seasonal
        endDate: z.string().optional()
    })
});

export const updatePricingSchema = z.object({
    body: z.object({
        amount: z.number().optional(),
        currency: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isActive: z.boolean().optional()
    })
});
