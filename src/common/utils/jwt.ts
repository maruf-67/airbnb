import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_EXPIRES = '6h';
const REFRESH_EXPIRES = '3d';

export interface ITokenPayload {
    id: string;
    role: string;
}

export interface IRefreshTokenPayload {
    id: string;
    uuid: string;
}

/**
 * Generate Access Token with separate payload
 * Payload: id, role
 */
export const generateAccessToken = (user: any): string => { // Using any for user temporarily to avoid circular deps with Model
    const roleName = user.role && user.role.name ? user.role.name : (typeof user.role === 'string' ? user.role : 'user');

    const payload: ITokenPayload = {
        id: user._id.toString(),
        role: roleName
    };

    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user: any): string => {
    const payload: IRefreshTokenPayload = {
        id: user._id.toString(),
        uuid: crypto.randomUUID()
    }
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): ITokenPayload => {
    return jwt.verify(token, ACCESS_SECRET) as ITokenPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): IRefreshTokenPayload => {
    return jwt.verify(token, REFRESH_SECRET) as IRefreshTokenPayload;
};
