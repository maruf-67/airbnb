import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50).optional(),
        role: z.string().optional(), // Role ID
        isVerified: z.boolean().optional(),
        avatar: z.string().nullable().optional(),
        phone: z.string().optional()
    })
});

export const getUsersSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
        role: z.string().optional(),
        isVerified: z.string().optional()
    })
});
