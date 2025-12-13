
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../modules/posts/post.model.js';
import User from '../modules/auth/user.model.js';

dotenv.config();

const connectIfNeeded = async () => {
    if (mongoose.connection.readyState === 0) {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb-test-rbac-v2';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    }
};

const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', // Modern House
    'https://images.unsplash.com/photo-1600596542815-2a4d9f1013d8?q=80&w=2075&auto=format&fit=crop', // Villa
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', // Tropical
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', // Luxury
    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1925&auto=format&fit=crop', // Mansion
    'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop', // Suburban
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop', // Modern Glass
    'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=2070&auto=format&fit=crop', // Estate
    'https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=2070&auto=format&fit=crop', // Cozy
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop', // Cabin
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1974&auto=format&fit=crop', // A-Frame
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop', // Snowy
    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop', // Suburban 2
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2069&auto=format&fit=crop', // Apartment
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop', // Interior
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop', // Nordic
    'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2066&auto=format&fit=crop', // Minimalist
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=668&auto=format&fit=crop', // City View
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070&auto=format&fit=crop', // California
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop', // Colorful
];

const LOCATIONS = [
    'Malibu, California', 'Aspen, Colorado', 'Miami, Florida', 'New York, NY',
    'Santorini, Greece', 'Bali, Indonesia', 'Paris, France', 'London, UK',
    'Tokyo, Japan', 'Cape Town, South Africa', 'Sydney, Australia', 'Kyoto, Japan',
    'Rome, Italy', 'Barcelona, Spain', 'Dubai, UAE', 'Vancouver, Canada',
    'Banff, Canada', 'Bora Bora, French Polynesia', 'Zurich, Switzerland', 'Queenstown, NZ'
];

const AMENITIES = [
    'Wifi', 'Pool', 'Hot tub', 'Parking', 'Air conditioning', 'Kitchen',
    'Gym', 'TV', 'Washer', 'Dryer', 'Heating', 'Workspace'
];

const TITLES = [
    'Luxury Beachfront Villa', 'Cozy Mountain Cabin', 'Modern City Apartment', 'Secluded Tropical Retreat',
    'Historic Downtown Loft', 'Spacious Family Home', 'Charming Countryside Cottage', 'Minimalist Studio with View',
    'Grand Estate with Pool', 'Ski-in/Ski-out Chalet', 'Rustic Forest Hideaway', 'Elegant Penthouse Suite',
    'Sunny Coastal Bungalow', 'Designer Desert Oasis', 'Traditional Ryokan Experience', 'Lakefront Paradise',
    'Eco-friendly Treehouse', 'Urban Industrial Loft', 'Romantic Vineyard Villa', 'Contemporary Art Filled Home'
];

const seedPosts = async () => {
    try {
        await connectIfNeeded();
        console.log('🌱 Seeding Posts...');

        // 1. Get Users to assign as owners
        const users = await User.find({ isVerified: true });
        if (users.length === 0) {
            throw new Error('No users found. Please run user seeder first.');
        }

        const postsToCreate = [];

        for (let i = 0; i < 20; i++) {
            const randomOwner = users[Math.floor(Math.random() * users.length)];
            const randomPrice = Math.floor(Math.random() * (1000 - 50) + 50); // $50 - $1000
            const randomGuests = Math.floor(Math.random() * 8) + 1;

            // Generate semi-random amenities
            const shuffledAmenities = [...AMENITIES].sort(() => 0.5 - Math.random());
            const selectedAmenities = shuffledAmenities.slice(0, Math.floor(Math.random() * 6) + 3);

            // Use specific images if index matches, else random
            const mainImage = SAMPLE_IMAGES[i % SAMPLE_IMAGES.length];
            const otherImages = [
                SAMPLE_IMAGES[(i + 1) % SAMPLE_IMAGES.length],
                SAMPLE_IMAGES[(i + 2) % SAMPLE_IMAGES.length],
                SAMPLE_IMAGES[(i + 3) % SAMPLE_IMAGES.length],
                SAMPLE_IMAGES[(i + 4) % SAMPLE_IMAGES.length],
            ]

            postsToCreate.push({
                title: TITLES[i % TITLES.length],
                description: `Experience the ultimate getaway in this ${TITLES[i % TITLES.length].toLowerCase()}. Located in the heart of ${LOCATIONS[i % LOCATIONS.length]}, this property offers stunning views and top-notch amenities. Perfect for families, couples, or solo travelers looking for a unique and memorable stay. Enjoy local attractions, fine dining, and serene surroundings right at your doorstep.`,
                price: randomPrice,
                location: LOCATIONS[i % LOCATIONS.length],
                images: [mainImage, ...otherImages],
                maxGuests: randomGuests,
                amenities: selectedAmenities,
                isPublished: true,
                owner: randomOwner._id,
                rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)) // Random rating 3.5 - 5.0
            });
        }

        // 2. Insert Posts
        let createdCount = 0;
        // Clean up existing for "best output" to avoid duplicates of same titles if re-run often without delete, but user said "add". 
        // Strategy: Check if title exists, if so skip, else create.

        for (const postData of postsToCreate) {
            const exists = await Post.findOne({ title: postData.title });
            if (!exists) {
                await Post.create(postData);
                createdCount++;
            }
        }

        console.log(`✅ Successfully seeded ${createdCount} new posts.`);

    } catch (error) {
        console.error('❌ Error Seeding Posts:', error);
        process.exit(1);
    } finally {
        if (process.argv[1] === fileURLToPath(import.meta.url)) {
            await mongoose.disconnect();
            process.exit(0);
        }
    }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedPosts();
}

export default seedPosts;
