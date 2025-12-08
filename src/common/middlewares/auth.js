import jwt from 'jsonwebtoken';
import {
    catchAsync
} from '../utils/catchAsync.js';
import {
    AppError
} from '../utils/AppError.js';
import User from '../../modules/auth/user.model.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and attaches user information to the request
 */
export const authenticateToken = catchAsync(async (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
        throw new AppError('Access token is required', 401);
    }

    // Verify the token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Token has expired', 401);
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid token', 401);
        }
        throw error;
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        throw new AppError('User not found or token invalid', 401);
    }

    // Attach user information to the request object
    req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
    };

    next();
});

/**
 * Role-based authorization middleware
 * Restricts access to users with specific roles
 * @param {...string} allowedRoles - Array of allowed roles (e.g., 'admin', 'user')
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError('Authentication required', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError('Insufficient permissions', 403);
        }

        next();
    };
};