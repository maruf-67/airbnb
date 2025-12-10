import express, { Request, Response } from 'express';
import authModuleRouter from '../modules/auth/auth.routes.js';
import roleModuleRouter from '../modules/role/role.routes.js';
// import userModuleRouter from '../modules/auth/user.routes.js';

const router = express.Router();
const apiV1Router = express.Router();

// Mount module routers to V1
apiV1Router.use('/auth', authModuleRouter);
apiV1Router.use('/roles', roleModuleRouter);
// apiV1Router.use('/users', userModuleRouter);

// Register V1 Router
router.use('/api/v1', apiV1Router);

// Home page
router.get('/', (req: Request, res: Response) => {
    res.render('index', {
        title: 'Airbnb Clone - Home'
    });
});

// API Documentation page
router.get('/docs', (req: Request, res: Response) => {
    res.render('docs', {
        title: 'API Documentation'
    });
});

// Health check
router.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

export default router;
