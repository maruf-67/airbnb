import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import User from './modules/auth/user.model.js';
import Role from './modules/role/role.model.js';
import BlacklistedToken from './common/models/BlacklistedToken.js';
import { generateAccessToken } from './common/utils/jwt.js';

dotenv.config();
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb-test-rbac-v2';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';

const verifyRoutes = async () => {
    try {
        console.log('Connecting to DB for Route Verification...');
        // Ensure we are connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        // Cleanup
        await User.deleteMany({});
        await Role.deleteMany({});
        await BlacklistedToken.deleteMany({});

        // 1. Setup Data
        const adminRole = await Role.create({ 
            name: 'admin', 
            permissions: ['role.read', 'role.create', 'role.update', 'role.delete'] 
        });
        const userRole = await Role.create({ 
            name: 'user', 
            permissions: ['role.read'] 
        });

        const admin = await User.create({
            name: 'Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: adminRole._id
        });

        const user = await User.create({
            name: 'User',
            email: 'user@test.com',
            password: 'password123',
            role: userRole._id
        });

        // 2. Generate Tokens
        // Need to populate role for token generation as per our logic
        await admin.populate('role');
        await user.populate('role');
        
        const adminToken = generateAccessToken(admin);
        const userToken = generateAccessToken(user);

        // 3. Test /api/v1 Prefix & Auth Middleware
        console.log('Testing Unauthenticated Request...');
        await request(app)
            .get('/api/v1/roles')
            .expect(401); // Unauthorized
        console.log('✅ Unauthenticated request blocked (401)');

        // 4. Test Authorized (User - has role.read)
        console.log('Testing User (Read Allowed)...');
        await request(app)
            .get('/api/v1/roles')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
        console.log('✅ User authorized for READ (200)');

        // 5. Test Forbidden (User - Create Denied)
        console.log('Testing User (Create Denied)...');
        await request(app)
            .post('/api/v1/roles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'newrole', permissions: [] })
            .expect(403);
        console.log('✅ User denied for CREATE (403)');

        // 6. Test Admin (Create Allowed)
        console.log('Testing Admin (Create Allowed)...');
        await request(app)
            .post('/api/v1/roles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'newrole', permissions: [] })
            .expect(201);
        console.log('✅ Admin authorized for CREATE (201)');

        console.log('✅ ROUTE VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('❌ ROUTE VERIFICATION FAILED:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

verifyRoutes();
