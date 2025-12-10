import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        // parse will throw ZodError on invalid input
        req.body = schema.parse(req.body);
        return next();
    } catch (err) {
        // If it's a Zod validation error, forward it to the global error handler
        if (err instanceof ZodError) return next(err);
        // Otherwise wrap and forward
        return next(err);
    }
};
