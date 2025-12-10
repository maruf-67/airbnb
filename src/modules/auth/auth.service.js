import bcrypt from 'bcryptjs';
import {
    AppError
} from '../../common/utils/AppError.js';
import User from './user.model.js';
import Role from '../role/role.model.js';
import BlacklistedToken from '../../common/models/BlacklistedToken.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';

const generateAuthResponse = async (user, oldRefreshToken = null) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // If rotating, remove old token
    if (oldRefreshToken) {
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== oldRefreshToken);
    }

    // Save refresh token to user DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // 3 days

    user.refreshTokens.push({
        token: refreshToken,
        expiresAt: expiresAt
    });

    // Clean up expired tokens
    user.refreshTokens = user.refreshTokens.filter(t => t.expiresAt > new Date());
    
    await user.save();

    return {
        user,
        accessToken,
        refreshToken
    };
};

export const registerUser = async (data) => {
    // Check for existing user
    const existing = await User.findOne({
        email: data.email.toLowerCase()
    });
    if (existing) throw new AppError('User already exists with this email', 409);

    const hashed = await bcrypt.hash(data.password, 12);

    let role = await Role.findOne({ name: 'user' });
    if (!role) {
        role = await Role.create({ name: 'user', permissions: [] });
    }

    const user = await User.create({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashed,
        role: role._id
    });

    delete user.password;
    await user.populate('role');

    return generateAuthResponse(user);
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({
        email: email.toLowerCase()
    }).select('+password').populate('role');

    if (!user) throw new AppError('Incorrect email or password', 401);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AppError('Incorrect email or password', 401);

    return generateAuthResponse(user);
};

export const logoutUser = async (userId, accessToken, currentRefreshToken) => {
    // 1. Blacklist Access Token
    await BlacklistedToken.create({ token: accessToken });

    // 2. Remove specific refresh token from User DB
    if (currentRefreshToken) {
        await User.updateOne(
            { _id: userId },
            { $pull: { refreshTokens: { token: currentRefreshToken } } }
        );
    }
};

export const refreshToken = async (token) => {
    try {
        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id).populate('role');
        if (!user) throw new AppError('User not found', 401);

        // Find and verify token in DB
        const tokenInDb = user.refreshTokens.find(t => t.token === token);
        if (!tokenInDb) {
            // Token Reuse Detection could go here (delete all tokens if used reused token detected)
            throw new AppError('Invalid refresh token (reuse detected)', 401);
        }

        // Use helper to Rotate (remove old, add new), Clean, and Save
        const result = await generateAuthResponse(user, token);

        return { 
            accessToken: result.accessToken, 
            refreshToken: result.refreshToken 
        };
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }
};