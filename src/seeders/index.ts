import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRoles from './roleSeeder.js';

dotenv.config();

const runAllSeeders = async () => {
    try {
        // 1. Check for specific Seeder Args
        const args = process.argv.slice(2);
        const specificSeeder = args[0]; // e.g., 'RoleSeeder'

        // 2. Map of available Seeders
        const seeders: Record<string, () => Promise<void>> = {
            'RoleSeeder': seedRoles,
            'roleSeeder': seedRoles, // Case insensitive alias
            // Add future seeders here
        };

        // 3. Determine which seeders to run
        let seedersToRun: (() => Promise<void>)[] = [];
        if (specificSeeder) {
            if (seeders[specificSeeder]) {
                console.log(`🎯 Targeted Seeder: ${specificSeeder}`);
                seedersToRun = [seeders[specificSeeder]];
            } else {
                console.error(`❌ Seeder '${specificSeeder}' not found! Available: ${Object.keys(seeders).join(', ')}`);
                process.exit(1);
            }
        } else {
            // Run ALL by default
            seedersToRun = Object.values(seeders);
            // Deduplicate if multiple keys point to same function (unlikely but safe)
            seedersToRun = [...new Set(seedersToRun)];
        }

        // 4. Connect to Database
        if (mongoose.connection.readyState === 0) {
            const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb-test-rbac-v2';
            await mongoose.connect(uri);
            console.log('✅ Connected to MongoDB');
        }

        // 5. Run Selected Seeders
        console.log('--- Starting Seeding Process ---');

        for (const seeder of seedersToRun) {
            await seeder();
        }

        console.log('--- Seeding Completed Successfully ---');

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    } finally {
        // 3. Disconnect
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('✅ Disconnected from MongoDB');
        }
        process.exit(0);
    }
};

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runAllSeeders();
}
