import {
    z
} from 'zod';
import {
    extendZodWithOpenApi
} from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Email regex pattern (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const RegisterSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().regex(EMAIL_REGEX, 'Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
    email: z.string().regex(EMAIL_REGEX, 'Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});