import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import * as Controller from './booking.controller.js';
import { CreateBookingSchema } from './booking.schema.js';

const router = Router();

router.post('/', authenticateToken, validate(CreateBookingSchema), Controller.create);
router.get('/my-bookings', authenticateToken, Controller.getMyBookings);

export default router;
