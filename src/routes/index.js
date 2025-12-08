import express from 'express';
import authModuleRouter from '../modules/auth/auth.routes.js';
// import userModuleRouter from '../modules/auth/user.routes.js';

const router = express.Router();

// Mount module routers
router.use('/api/auth', authModuleRouter);
// router.use('/api/users', userModuleRouter);

// Home page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Airbnb Clone - Home'
    });
});

// API Documentation page
router.get('/docs', (req, res) => {
    res.render('docs', {
        title: 'API Documentation'
    });
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

export default router;