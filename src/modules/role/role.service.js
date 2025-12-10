import Role from './role.model.js';
import { AppError } from '../../common/utils/AppError.js';

export const createRole = async (data) => {
    const existing = await Role.findOne({ name: data.name });
    if (existing) throw new AppError('Role already exists', 409);
    return await Role.create(data);
};

export const getAllRoles = async () => {
    return await Role.find();
};

export const getRoleById = async (id) => {
    const role = await Role.findById(id);
    if (!role) throw new AppError('Role not found', 404);
    return role;
};

export const updateRole = async (id, data) => {
    const role = await Role.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!role) throw new AppError('Role not found', 404);
    return role;
};

export const deleteRole = async (id) => {
    const role = await Role.findByIdAndDelete(id);
    if (!role) throw new AppError('Role not found', 404);
    return role;
};
