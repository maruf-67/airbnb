import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    AppError
} from '../../common/utils/AppError.js';
import User from './user.model.js';

const generateAuthResponse = (user) => {
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    return {
        user,
        token
    };
};

export const registerUser = async (data) => {
    // Check for existing user (email is normalized in pre-save hook)
    const existing = await User.findOne({
        email: data.email.toLowerCase()
    });
    if (existing) throw new AppError('User already exists with this email', 409);

    // Hash password with optimal cost factor
    const hashed = await bcrypt.hash(data.password, 12);

    // Create user (email normalization handled by pre-save hook)
    const user = await User.create({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashed
    });

    return generateAuthResponse(user);
};

export const loginUser = async (email, password) => {
    // Find user by normalized email
    const user = await User.findOne({
        email: email.toLowerCase()
    }).select('+password'); // Include password for comparison

    if (!user) throw new AppError('Incorrect email or password', 401);

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AppError('Incorrect email or password', 401);

    return generateAuthResponse(user);
};