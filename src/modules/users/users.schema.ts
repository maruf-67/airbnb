import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50),
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        password: z.string().min(6),
        role: z.string(), // Role ID
        isActive: z.boolean().optional(),
        phone: z.string().optional()
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50).optional(),
        role: z.string().optional(), // Role ID
        isVerified: z.boolean().optional(),
        isActive: z.boolean().optional(),
        avatar: z.string().nullable().optional(),
        phone: z.string().optional(),
        password: z.string().min(6).optional()
    })
});

export const getUsersSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
        role: z.string().optional(),
        roleType: z.string().optional(),
        isVerified: z.string().optional(),
        isActive: z.string().optional(),
        sort: z.string().optional(),
        order: z.enum(['asc', 'desc']).optional()
    })
});
