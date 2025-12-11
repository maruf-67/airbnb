import User from '../auth/user.model.js';
import { AppError } from '../../common/utils/AppError.js';

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

        // Role filtering would require looking up the role ID or populating first.
        // simpler to just filter if passed ID
        if (query.role) {
            filter.role = query.role;
        }

        const users = await User.find(filter)
            .populate('role')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

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

    async getUserById(id: string) {
        const user = await User.findById(id).populate('role');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async updateUser(id: string, data: any) {
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
