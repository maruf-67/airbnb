import Role from './role.model.js';
import { AppError } from '../../common/utils/AppError.js';
import { CreateRoleInput, UpdateRoleInput } from './role.schema.js';

export const createRole = async (data: CreateRoleInput) => {
    const existing = await Role.findOne({ name: data.name });
    if (existing) throw new AppError('Role already exists', 409);
    return await Role.create(data);
};

export const getAllRoles = async () => {
    return await Role.find();
};

export const getRoleById = async (id: string) => {
    const role = await Role.findById(id);
    if (!role) throw new AppError('Role not found', 404);
    return role;
};

export const updateRole = async (id: string, data: UpdateRoleInput) => {
    const role = await Role.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!role) throw new AppError('Role not found', 404);
    return role;
};

export const deleteRole = async (id: string) => {
    const role = await Role.findByIdAndDelete(id);
    if (!role) throw new AppError('Role not found', 404);
    return role;
};
