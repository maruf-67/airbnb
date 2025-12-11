import { Request, Response, NextFunction } from 'express';
import { requestContext } from '../utils/requestContext.js';

export const contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const store = {
        user: (req as any).user, // Will be populated by auth middleware
        ip: req.ip || req.socket.remoteAddress,
    };

    requestContext.run(store, () => {
        next();
    });
};
