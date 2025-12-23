import mongoose, { InferSchemaType } from 'mongoose';
import { auditPlugin } from '../../common/models/plugins/auditPlugin.js';

const bookingSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    specialRequests: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

bookingSchema.plugin(auditPlugin);

// compound index for efficient overlap queries
bookingSchema.index({ post: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

export type BookingDocument = InferSchemaType<typeof bookingSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export default mongoose.model('Booking', bookingSchema);
