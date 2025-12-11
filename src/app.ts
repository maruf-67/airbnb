// -------------------------------
// Import required dependencies
// -------------------------------

// Core express framework for handling server & routes
import express from 'express';
import { fileURLToPath } from 'url';

// CORS middleware to allow cross-origin API calls
import cors from 'cors';

// Helmet sets secure HTTP headers for better security
import helmet from 'helmet';

// HTTP request logger (useful in development)
import morgan from 'morgan';

// Environment variable loader (.env)
import dotenv from 'dotenv';

// Middleware for parsing cookies
import cookieParser from 'cookie-parser';

// Custom functions to get view & static asset paths
import {
    getViewsPath,
    getAssetsPath
} from './common/utils/pathUtils.js';

// MongoDB connection method
import connectDB from './config/db.js';

// Main router that contains all module routes
import router from './routes/index.js';

// Error handling utilities
import {
    AppError
} from './common/utils/AppError.js';
import {
    globalErrorHandler
} from './common/middlewares/errorHandler.js';
import {
    contextMiddleware
} from './common/middlewares/contextMiddleware.js';


// -------------------------------
// Load environment variables
// -------------------------------
dotenv.config(); // Reads .env and injects into process.env


// -------------------------------
// Initialize express application
// -------------------------------
const app = express();

// Server port, fallback to 3000 if not defined
const PORT = process.env.PORT || 3000;


// -------------------------------
// View Engine Setup (EJS example)
// -------------------------------

// Set EJS as the template rendering engine
app.set('view engine', 'ejs');

// Set the directory where EJS templates will be stored
app.set('views', getViewsPath());


// -------------------------------
// Global Middleware
// -------------------------------

// Security headers (prevents common attacks)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "http://localhost:3009", "https:"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Enables cross-origin access (frontend → backend)
app.use(cors());

// Log incoming requests in Apache combined format
app.use(morgan('combined'));

// Parse JSON bodies (POST/PUT requests)
app.use(express.json());

// Parse URL encoded forms (HTML forms)
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(contextMiddleware);

// app.set('trust proxy', true);


// -------------------------------
// Static Assets (CSS, JS, images)
// -------------------------------

// Serve static files from /assets folder
app.use('/assets', express.static(getAssetsPath()));

// Serve uploaded files (avatars, etc.)
app.use('/uploads', express.static('public/uploads'));


// -------------------------------
// Mount Main Application Routes
// -------------------------------
app.use(router); // all routes come from /routes/index.js


// -------------------------------
// 404 Not Found Handler
// (Runs when no route matches)
// -------------------------------
// 404 Handler (create AppError and forward)
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// -------------------------------
// General Error Handler
// (Catches all thrown errors)
// -------------------------------
// GLOBAL ERROR HANDLER (must be last middleware)
app.use(globalErrorHandler);


// -------------------------------
// Start Server Only After
// Successful MongoDB Connection
// -------------------------------
// Only start server if run directly (not imported)
// Note: TS might complain about import.meta props if module settings aren't right, but NodeNext handles it.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    connectDB()
        .then(() => {
            // Start listening on given port
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((err) => {
            // If DB fails → stop the app
            console.error('Failed to connect to database:', err);
            process.exit(1);
        });
}


// Export express instance (important for testing)
export default app;
