import {
    ZodError
} from 'zod';

export const validate = (schema) => (req, res, next) => {
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