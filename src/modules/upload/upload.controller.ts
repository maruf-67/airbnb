import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';

export const uploadFile = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new Error('Please upload a file');
    }

    const fileUrl = `${process.env.API_URL || 'http://localhost:3050'}/uploads/${req.file.filename}`;

    sendSuccess(res, { url: fileUrl }, 'File uploaded successfully');
});
