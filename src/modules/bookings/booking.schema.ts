import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateBookingSchema = z.object({
    body: z.object({
        postId: z.string().min(1, 'Post ID is required'),
        checkIn: z.string().datetime({ message: 'Invalid check-in date' }),
        checkOut: z.string().datetime({ message: 'Invalid check-out date' }),
        guests: z.number().int().positive().min(1),
        specialRequests: z.string().optional(),
    }).refine((data) => {
        const start = new Date(data.checkIn);
        const end = new Date(data.checkOut);
        return end > start;
    }, {
        message: 'Check-out date must be after check-in date',
        path: ['checkOut'],
    })
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>['body'];
