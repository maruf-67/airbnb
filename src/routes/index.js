import express from 'express';
// import userRoutes from './users.js';

const router = express.Router();

// Mount routes
// router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

export default router;