import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import * as RoleService from './role.service.js';

export const createRole = catchAsync(async (req: Request, res: Response) => {
    const role = await RoleService.createRole(req.body);
    sendSuccess(res, role, 'Role created successfully', 201);
});

export const getRoles = catchAsync(async (req: Request, res: Response) => {
    const roles = await RoleService.getAllRoles();
    sendSuccess(res, roles);
});

export const getRole = catchAsync(async (req: Request, res: Response) => {
    const role = await RoleService.getRoleById(req.params.id as string);
    sendSuccess(res, role);
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
    const role = await RoleService.updateRole(req.params.id as string, req.body);
    sendSuccess(res, role, 'Role updated successfully');
});

export const deleteRole = catchAsync(async (req: Request, res: Response) => {
    await RoleService.deleteRole(req.params.id as string);
    sendSuccess(res, null, 'Role deleted successfully');
});
