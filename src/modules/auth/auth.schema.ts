import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const RegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(50),
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password too long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
    })
});

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
        password: z.string().min(1, 'Password is required')
    })
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
