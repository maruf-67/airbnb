import {
    catchAsync
} from '../../common/utils/catchAsync.js';
import * as AuthService from './auth.service.js';

export const register = catchAsync(async (req, res) => {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json({
        success: true,
        data: result
    });
});

export const login = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body.email, req.body.password);
    res.json({
        success: true,
        data: result
    });
});