import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../modules/role/role.model.js';
import { PERMISSIONS, PERMISSION_GROUPS } from '../common/constants/permissions.js';

dotenv.config();

// Connect if not already connected (for standalone execution)
const connectIfNeeded = async () => {
    if (mongoose.connection.readyState === 0) {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb-test-rbac-v2';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    }
};

const seedRoles = async () => {
    try {
        await connectIfNeeded();

        console.log('Seeding Roles...');

        // 1. Define Roles to Create
        const rolesToSeed = [
            {
                name: 'super_admin',
                title: 'Super Admin',
                type: 'admin',
                permissions: PERMISSION_GROUPS.SUPER_ADMIN,
                isActive: true
            },
            {
                name: 'admin',
                title: 'Administrator',
                type: 'admin',
                permissions: PERMISSION_GROUPS.ADMIN,
                isActive: true
            },
            {
                name: 'user',
                title: 'Generic User',
                type: 'user',
                permissions: PERMISSION_GROUPS.USER,
                isActive: true
            }
        ];

        // 2. Iterate and Update/Upsert
        for (const roleData of rolesToSeed) {
            await Role.findOneAndUpdate(
                { name: roleData.name }, // Find by name
                roleData,               // Update data
                { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not exists
            );
            console.log(`Verified Role: ${roleData.title} (${roleData.name})`);
        }

        console.log('✅ Roles Seeded Successfully');

    } catch (error) {
        console.error('❌ Error Seeding Roles:', error);
        process.exit(1);
    } finally {
        // Disconnect if we initiated the connection
        if (process.argv[1] === import.meta.url) {
            await mongoose.disconnect();
            process.exit(0);
        }
    }
};

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedRoles();
}

export default seedRoles;
