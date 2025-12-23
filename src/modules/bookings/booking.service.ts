import { AppError } from '../../common/utils/AppError.js';
import Booking from './booking.model.js';
import Post from '../posts/post.model.js'; // Assuming post.model.ts is here
import { CreateBookingInput } from './booking.schema.js';

export const createBooking = async (data: CreateBookingInput, userId: string) => {
    // 1. Fetch Post to get price and verify existence
    const post = await Post.findById(data.postId);
    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (!post.isPublished) {
        throw new AppError('Post is not available for booking', 400);
    }

    if (post.owner.toString() === userId) {
        throw new AppError('You cannot book your own property', 400);
    }

    // 2. Check for date collisions
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    const conflictingBooking = await Booking.findOne({
        post: data.postId,
        status: { $in: ['pending', 'confirmed'] }, // Ignore cancelled bookings
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
    });

    if (conflictingBooking) {
        throw new AppError('Dates are already booked', 409);
    }

    // 3. Calculate total price
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < 1) {
        throw new AppError('Booking must be for at least 1 night', 400);
    }

    // Price is per night. Assuming post.price is in regular units, and we might want cents, 
    // but based on previous schema checks, price was likely just a number. 
    // Let's assume price is just a number.
    const totalPrice = nights * post.price;

    // 4. Create Booking
    const booking = await Booking.create({
        post: data.postId,
        user: userId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: data.guests,
        totalPrice: totalPrice,
        specialRequests: data.specialRequests,
        status: 'confirmed', // Auto-confirm for now as we don't have payment flow
        paymentStatus: 'paid' // Auto-pay for now
    });

    return booking;
};

export const getBookingsByUser = async (userId: string) => {
    return await Booking.find({ user: userId })
        .populate('post', 'title location images price')
        .sort({ createdAt: -1 });
};

export const getBookingsForPost = async (postId: string, userId: string) => {
    // Verify user owns the post
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError('Post not found', 404);
    }
    if (post.owner.toString() !== userId) {
        throw new AppError('Unauthorized access to post bookings', 403);
    }

    return await Booking.find({ post: postId })
        .populate('user', 'name email avatar')
        .sort({ checkIn: 1 });
};
