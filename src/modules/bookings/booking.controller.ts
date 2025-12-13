import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import * as bookingService from './booking.service.js';

export const create = catchAsync(async (req: Request, res: Response) => {
    const booking = await bookingService.createBooking(req.body, (req as any).user.id);
    sendSuccess(res, booking, 'Booking created successfully', 201);
});

export const getMyBookings = catchAsync(async (req: Request, res: Response) => {
    const bookings = await bookingService.getBookingsByUser((req as any).user.id);
    sendSuccess(res, bookings, 'Bookings retrieved successfully');
});
