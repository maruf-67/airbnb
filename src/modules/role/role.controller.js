import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import * as RoleService from './role.service.js';

export const createRole = catchAsync(async (req, res) => {
    const role = await RoleService.createRole(req.body);
    sendSuccess(res, role, 'Role created successfully', 201);
});

export const getRoles = catchAsync(async (req, res) => {
    const roles = await RoleService.getAllRoles();
    sendSuccess(res, roles);
});

export const getRole = catchAsync(async (req, res) => {
    const role = await RoleService.getRoleById(req.params.id);
    sendSuccess(res, role);
});

export const updateRole = catchAsync(async (req, res) => {
    const role = await RoleService.updateRole(req.params.id, req.body);
    sendSuccess(res, role, 'Role updated successfully');
});

export const deleteRole = catchAsync(async (req, res) => {
    await RoleService.deleteRole(req.params.id);
    sendSuccess(res, null, 'Role deleted successfully');
});
