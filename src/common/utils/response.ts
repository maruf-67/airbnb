import { Response } from 'express';

/**
 * Standardized API response utilities
 * Provides consistent response format across all endpoints
 */

/**
 * Send success response with flexible parameters
 */
export const sendSuccess = (res: Response, data: unknown = null, message: string | null = null, statusCode: number = 200) => {
    const response = {
        success: true,
        ...(message ? { message } : {}),
        ...(data ? { data } : {}),
    };

    return res.status(statusCode).json(response);
};
