import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import dotenv from 'dotenv';
import {
    getViewsPath,
    getAssetsPath
} from './utils/pathUtils.js';
import connectDB from './config/db.js';
import router from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', getViewsPath());

// Middleware
// app.use(helmet());
// app.use(cors());
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Serve static assets
app.use('/assets', express.static(getAssetsPath()));

// Routes
app.use(router);

// 404 handler
app.use((req, res, next) => {
    res.status(404).sendFile(getViewsPath('404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Server Error',
        message: 'Something went wrong on our end.',
        error: process.env.NODE_ENV === 'development' ? err : null
    });
});

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

export default app;