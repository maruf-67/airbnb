import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../modules/auth/user.model.js';
import Role from '../modules/role/role.model.js';

dotenv.config();

const connectIfNeeded = async () => {
    if (mongoose.connection.readyState === 0) {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb-test-rbac-v2';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    }
};

const seedSuperAdmin = async () => {
    try {
        await connectIfNeeded();
        console.log('Seeding Super Admin...');

        // 1. Get Super Admin Role
        const superAdminRole = await Role.findOne({ name: 'super_admin' });
        if (!superAdminRole) {
            throw new Error('Super Admin role not found. Please run role seeder first.');
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 3. Create/Update Super Admin User
        const superAdminData = {
            name: 'Super Admin',
            email: 'super@admin.com',
            password: hashedPassword,
            role: superAdminRole._id,
            isVerified: true
        };

        const user = await User.findOneAndUpdate(
            { email: superAdminData.email },
            superAdminData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`✅ Super Admin Seeded: ${user.email}`);

    } catch (error) {
        console.error('❌ Error Seeding Super Admin:', error);
        process.exit(1);
    } finally {
        if (process.argv[1] === fileURLToPath(import.meta.url)) {
            await mongoose.disconnect();
            process.exit(0);
        }
    }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedSuperAdmin();
}

export default seedSuperAdmin;
