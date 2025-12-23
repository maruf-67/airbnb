import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createPostSchema = z.object({
    body: z.object({
        title: z.string().min(5).max(100),
        description: z.string().min(10),
        price: z.number().min(0),
        location: z.string(),
        images: z.array(z.string()).optional(),
        maxGuests: z.number().int().min(1).default(1),
        amenities: z.array(z.string()).optional()
    })
});

export const updatePostSchema = z.object({
    body: z.object({
        title: z.string().min(5).max(100).optional(),
        description: z.string().min(10).optional(),
        price: z.number().min(0).optional(),
        location: z.string().optional(),
        images: z.array(z.string()).optional(),
        maxGuests: z.number().int().min(1).optional(),
        amenities: z.array(z.string()).optional(),
        isPublished: z.boolean().optional()
    })
});

export const getPostsSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        location: z.string().optional()
    })
});
