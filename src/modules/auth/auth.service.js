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
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return {
        user,
        token
    };
};

export const registerUser = async (data) => {
    const existing = await User.findOne({
        email: data.email.toLowerCase()
    });
    if (existing) throw new AppError('User already exists with this email', 409);

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({
        ...data,
        email: data.email.toLowerCase().trim(),
        password: hashed
    });

    return generateAuthResponse(user);
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({
        email: email.toLowerCase()
    });
    if (!user) throw new AppError('Incorrect email or password', 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AppError('Incorrect email or password', 401);

    return generateAuthResponse(user);
};