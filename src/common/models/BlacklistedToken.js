import mongoose from 'mongoose';

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 21600 // 6 hours in seconds (matches JWT_ACCESS_EXPIRES)
    }
});

export default mongoose.model('BlacklistedToken', blacklistedTokenSchema);
