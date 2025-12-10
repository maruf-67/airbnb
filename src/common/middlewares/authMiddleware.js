import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../../modules/auth/user.model.js';
import BlacklistedToken from '../models/BlacklistedToken.js';
import { catchAsync } from '../utils/catchAsync.js';

export const authenticateToken = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new AppError('Access denied. No token provided.', 401);
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
        throw new AppError('Token has been revoked. Please login again.', 401);
    }

    try {
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id).populate('role');
        
        if (!user) {
            throw new AppError('User belonging to this token no longer exists.', 401);
        }

        req.user = user;
        req.token = token; // Store token for logout
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Token expired.', 401);
        }
        throw new AppError('Invalid token.', 403);
    }
});
