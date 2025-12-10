import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

const handleZodError = (err: ZodError) => {
    const message = err.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
    return new AppError(message, 400);
};

const handleMongoDuplicateError = (err: any) => {
    try {
        const keys = err.keyValue ? Object.keys(err.keyValue) : [];
        const field = keys[0] || 'field';
        const value = err.keyValue ? (err.keyValue as any)[field] : '';
        const message = `Duplicate field value: ${field} (${value}). Please use another value!`;
        return new AppError(message, 409);
    } catch (e) {
        return new AppError('Duplicate key error', 409);
    }
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // ensure we have statusCode and status
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥', err);
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    // Production path – sanitize details
    let error = {
        ...err,
        message: err.message,
        isOperational: err.isOperational
    };

    if (err instanceof ZodError) error = handleZodError(err);
    if (err.code === 11000) error = handleMongoDuplicateError(err);

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }

    // Unknown error — don't leak details
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};
