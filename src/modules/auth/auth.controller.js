import {
    catchAsync
} from '../../common/utils/catchAsync.js';
import {
    sendSuccess
} from '../../common/utils/response.js';
import * as AuthService from './auth.service.js';

export const register = catchAsync(async (req, res) => {
    const result = await AuthService.registerUser(req.body);
    sendSuccess(res, result, 'User registered successfully', 201);
});

export const login = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body.email, req.body.password);
    sendSuccess(res, result);
});