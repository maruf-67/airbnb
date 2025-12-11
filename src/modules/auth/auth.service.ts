import bcrypt from 'bcryptjs';
import { AppError } from '../../common/utils/AppError.js';
import User, { UserDocument } from './user.model.js';
import Role from '../role/role.model.js';
import BlacklistedToken from '../../common/models/BlacklistedToken.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';
import { LoginInput, RegisterInput } from './auth.schema.js';

interface AuthResponse {
    user: any;
    accessToken: string;
    refreshToken: string;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const sanitizeUser = (user: UserDocument) => {
    const userObject = user.toObject();

    // Explicitly delete sensitive fields
    delete userObject.password;
    delete userObject.refreshTokens;
    delete userObject.__v;
    delete userObject.updated_ip;
    delete userObject.created_ip;
    delete userObject.created_by;
    delete userObject.updated_by;

    // Flatten role object
    if (userObject.role && typeof userObject.role === 'object') {
        const roleFn = userObject.role as any;
        userObject.role = {
            name: roleFn.name,
            title: roleFn.title,
            type: roleFn.type,
            permissions: roleFn.permissions
        };
    }

    return userObject;
};

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
        user: sanitizeUser(user),
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

export const updateProfile = async (userId: string, data: { name?: string; email?: string; phone?: string; bio?: string }): Promise<any> => {
    const user = await User.findById(userId).populate('role');
    if (!user) throw new AppError('User not found', 404);

    // Check if email is being changed and if it's already taken
    if (data.email && data.email.toLowerCase() !== user.email) {
        const existing = await User.findOne({ email: data.email.toLowerCase() });
        if (existing) throw new AppError('Email already in use', 409);
    }

    // Update allowed fields
    if (data.name) user.name = data.name.trim();
    if (data.email) user.email = data.email.toLowerCase().trim();
    if (data.phone !== undefined) user.phone = data.phone.trim() || null;
    // Note: bio field doesn't exist in model, but we'll allow it to pass through

    await user.save();

    return sanitizeUser(user);
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) throw new AppError('Current password is incorrect', 401);

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
};

export const uploadAvatar = async (userId: string, filename: string): Promise<any> => {
    const user = await User.findById(userId).populate('role');
    if (!user) throw new AppError('User not found', 404);

    // Update avatar path
    user.avatar = `/uploads/avatars/${filename}`;
    await user.save();

    return sanitizeUser(user);
};
