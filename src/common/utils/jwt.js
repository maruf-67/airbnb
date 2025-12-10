import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_EXPIRES = '6h';
const REFRESH_EXPIRES = '3d';

/**
 * Generate Access Token with separate payload
 * Payload: id, role
 */
export const generateAccessToken = (user) => {
    const roleName = user.role && user.role.name ? user.role.name : (typeof user.role === 'string' ? user.role : 'user');

    const payload = {
        id: user._id,
        role: roleName
    };

    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        uuid: crypto.randomUUID() 
    }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
