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

// Password regex - requires at least one uppercase, lowercase, number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const RegisterSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim()
        .transform(val => val.replace(/\s+/g, ' ')), // Normalize multiple spaces
    email: z.string()
        .regex(EMAIL_REGEX, 'Invalid email address')
        .transform(val => val.toLowerCase().trim()),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(PASSWORD_REGEX, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .max(128, 'Password must not exceed 128 characters'),
});

export const LoginSchema = z.object({
    email: z.string()
        .regex(EMAIL_REGEX, 'Invalid email address')
        .transform(val => val.toLowerCase().trim()),
    password: z.string()
        .min(1, 'Password is required')
        .max(128, 'Password too long'),
});