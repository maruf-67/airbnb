import bcrypt from 'bcryptjs';
import { AppError } from '../../common/utils/AppError.js';
import User, { UserDocument } from './user.model.js';
import Role from '../role/role.model.js';
import BlacklistedToken from '../../common/models/BlacklistedToken.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';
import { LoginInput, RegisterInput } from './auth.schema.js';

interface AuthResponse {
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

const generateAuthResponse = async (user: UserDocument, oldRefreshToken: string | null = null): Promise<AuthResponse> => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // If rotating, remove old token
    if (oldRefreshToken) {
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== oldRefreshToken) as any;
    }

    // Save refresh token to user DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // 3 days

    user.refreshTokens.push({
        token: refreshToken,
        expiresAt: expiresAt,
        // @ts-ignore - mongoose subdoc
        _id: undefined
    });

    // Clean up expired tokens
    user.refreshTokens = user.refreshTokens.filter(t => t.expiresAt > new Date()) as any;

    await user.save();

    return {
        user,
        accessToken,
        refreshToken
    };
};

export const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
    // Check for existing user
    const existing = await User.findOne({
        email: data.email.toLowerCase()
    });
    if (existing) throw new AppError('User already exists with this email', 409);

    const hashed = await bcrypt.hash(data.password, 12);

    let role = await Role.findOne({ name: 'user' });
    if (!role) {
        // Create default user role if not exists
        role = await Role.create({ name: 'user', permissions: [] });
    }

    const user = await User.create({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashed,
        role: role._id
    });

    // Clean password from instance before returning (toJSON handles it but good to be safe)
    user.password = undefined as any;

    await user.populate('role');

    return generateAuthResponse(user);
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const user = await User.findOne({
        email: email.toLowerCase()
    }).select('+password').populate('role');

    if (!user) throw new AppError('Incorrect email or password', 401);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AppError('Incorrect email or password', 401);

    return generateAuthResponse(user);
};

export const logoutUser = async (userId: string, accessToken: string, currentRefreshToken?: string): Promise<void> => {
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

export const refreshToken = async (token: string): Promise<TokenResponse> => {
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
        console.error("Refresh Token Error", error);
        throw new AppError('Invalid refresh token', 401);
    }
};
