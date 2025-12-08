/**
 * Standardized API response utilities
 * Provides consistent response format across all endpoints
 */

/**
 * Send success response with flexible parameters
 * @param {Object} res - Express response object
 * @param {*} data - Response data (optional)
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * 
 * Usage:
 *   sendSuccess(res, data)
 *   sendSuccess(res, data, 'Success message')
 *   sendSuccess(res, data, 'Created', 201)
 *   sendSuccess(res, data, null, 201)
 */
export const sendSuccess = (res, data = null, message = null, statusCode = 200) => {
    const response = {
        success: true,
        ...(message && {
            message
        }),
        ...(data && {
            data
        }),
    };

    return res.status(statusCode).json(response);
};