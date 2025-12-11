import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import * as RoleService from './role.service.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';

export const getPermissions = catchAsync(async (req: Request, res: Response) => {
    // Transform permissions object into a list of objects with metadata
    const permissions = Object.values(PERMISSIONS).map(slug => {
        const [module = '', action = ''] = slug.split('.');
        const name = `${action.charAt(0).toUpperCase() + action.slice(1)} ${module.charAt(0).toUpperCase() + module.slice(1)}`;

        return {
            id: slug,
            slug,
            name: name, // e.g. "Read Role"
            module: module.charAt(0).toUpperCase() + module.slice(1), // e.g. "Role"
            description: `Allows ${action} access to ${module}`
        };
    });

    sendSuccess(res, permissions);
});

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
