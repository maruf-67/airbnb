import express from 'express';
// import userRoutes from './users.js';

const router = express.Router();

// Mount routes
// router.use('/users', userRoutes);

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