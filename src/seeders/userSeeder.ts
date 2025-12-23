
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

const seedUsers = async () => {
    try {
        await connectIfNeeded();
        console.log('🌱 Seeding Users...');

        // 1. Get User Role
        const userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
            throw new Error('User role not found. Please run role seeder first.');
        }

        // 2. Prepare Users
        const usersToCreate = [];
        const passwordHash = await bcrypt.hash('password123', 10);

        for (let i = 1; i <= 20; i++) {
            usersToCreate.push({
                name: `Test User ${i}`,
                email: `testuser${i}@example.com`,
                password: passwordHash,
                role: userRole._id,
                isActive: true,
                isVerified: true,
                phone: `+123456789${i.toString().padStart(2, '0')}`,
                avatar: null
            });
        }

        // 3. Insert Users
        // Check for existing emails to avoid duplicates during re-runs
        let createdCount = 0;
        for (const userData of usersToCreate) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                await User.create(userData);
                createdCount++;
            }
        }

        console.log(`✅ Successfully seeded ${createdCount} new users.`);

    } catch (error) {
        console.error('❌ Error Seeding Users:', error);
        process.exit(1);
    } finally {
        if (process.argv[1] === fileURLToPath(import.meta.url)) {
            await mongoose.disconnect();
            process.exit(0);
        }
    }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedUsers();
}

export default seedUsers;
