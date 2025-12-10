import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createRoleSchema = z.object({
    name: z.string().min(2).max(50),
    title: z.string().optional(),
    permissions: z.array(z.string()).optional(),
    type: z.enum(['admin', 'user']).optional(),
    isActive: z.boolean().optional()
});

export const updateRoleSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    title: z.string().optional(),
    permissions: z.array(z.string()).optional(),
    type: z.enum(['admin', 'user']).optional(),
    isActive: z.boolean().optional()
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
