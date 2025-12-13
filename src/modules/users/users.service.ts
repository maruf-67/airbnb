import User from '../auth/user.model.js';
import { AppError } from '../../common/utils/AppError.js';
import Role from '../role/role.model.js';
import bcrypt from 'bcryptjs';

export class UserService {
    async getAllUsers(query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ];
        }
        if (query.isVerified !== undefined) {
            filter.isVerified = query.isVerified === 'true';
        }
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === 'true';
        }

        // Role filtering
        if (query.role) {
            filter.role = query.role;
        }

        if (query.roleType) {
            const roles = await import('../role/role.model.js').then(m => m.default.find({ type: query.roleType }));
            const roleIds = roles.map(role => role._id);
            if (roleIds.length > 0) {
                if (filter.role) {
                    const validRole = roleIds.find(id => id.toString() === filter.role.toString());
                    if (!validRole) {
                        return {
                            users: [],
                            pagination: { page, limit, total: 0, pages: 0 }
                        };
                    }
                } else {
                    filter.role = { $in: roleIds };
                }
            } else {
                return {
                    users: [],
                    pagination: { page, limit, total: 0, pages: 0 }
                };
            }
        }

        // Sorting
        const sort: any = {};
        if (query.sort) {
            const order = query.order === 'asc' ? 1 : -1;
            if (query.sort === 'role') {
                // Sorting by role name is tricky with Mongoose without aggregation or population sort
                // For simplicity, we'll sort by role ID if requested, or ideally use aggregation.
                // But for now, let's just allow sorting by fields on the User model.
                // If user really wants role name sort, we need to use aggregation or sort in JS (bad for pagination).
                // Let's stick to simple field sort for now or use 'role' as role ID.
                sort.role = order;
            } else {
                sort[query.sort] = order;
            }
        } else {
            sort.createdAt = -1;
        }

        const users = await User.find(filter)
            .populate('role')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async createUser(data: any) {
        // Validate Role exists
        const role = await Role.findById(data.role);
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        // Check if email exists
        const existing = await User.findOne({ email: data.email.toLowerCase() });
        if (existing) {
            throw new AppError('User already exists with this email', 409);
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await User.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            password: hashedPassword,
            role: data.role,
            isActive: data.isActive ?? true,
            // phone and avatar if provided
            ...(data.phone && { phone: data.phone }),
            ...(data.avatar && { avatar: data.avatar })
        });

        // Remove password from response
        user.password = undefined as any;
        await user.populate('role');

        return user;
    }

    async getUserById(id: string) {
        const user = await User.findById(id).populate('role');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async updateUser(id: string, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
        } else {
            delete data.password;
        }

        const user = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }).populate('role');

        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async deleteUser(id: string) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return true;
    }
}

export const userService = new UserService();
