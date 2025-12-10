
import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import {
    sendSuccess
} from '../../common/utils/response.js';
import * as AuthService from './auth.service.js';
import { AppError } from '../../common/utils/AppError.js';
import { AuthRequest } from '../../common/middlewares/authMiddleware.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
};

export const register = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.registerUser(req.body);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    sendSuccess(res, { user, accessToken }, 'User registered successfully', 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.loginUser(req.body.email, req.body.password);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    sendSuccess(res, { user, accessToken });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const refreshToken = req.cookies.refreshToken;
    const accessToken = authReq.token!; // Attached by middleware
    const userId = authReq.user._id.toString();

    await AuthService.logoutUser(userId, accessToken, refreshToken);

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    sendSuccess(res, null, 'Logged out successfully');
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError('Refresh token not found', 401);

    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(token);

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

    sendSuccess(res, { accessToken });
});
