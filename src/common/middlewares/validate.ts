import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        }) as any;

        // Assign validated values back to request
        // Check if specific parts were validated before assigning
        if (validated.body !== undefined) req.body = validated.body;

        // req.query and req.params might be getters (read-only) in some adapters
        // so we mutate them instead of reassignment
        if (validated.query !== undefined) {
            Object.assign(req.query, validated.query);
        }

        if (validated.params !== undefined) {
            Object.assign(req.params, validated.params);
        }
        return next();
    } catch (err) {
        // If it's a Zod validation error, forward it to the global error handler
        if (err instanceof ZodError) return next(err);
        // Otherwise wrap and forward
        return next(err);
    }
};
