import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import { userService } from './users.service.js';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers(req.query);
    sendSuccess(res, result, 'Users retrieved successfully');
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    sendSuccess(res, user, 'User retrieved successfully');
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.params.id as string, req.body);
    sendSuccess(res, user, 'User updated successfully');
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id as string);
    sendSuccess(res, null, 'User deleted successfully');
});
