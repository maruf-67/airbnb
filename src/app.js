import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// app.use(helmet());
// app.use(cors());
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.use(router);
app.use('/', (req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.get('/', (req, res, next) => {
    console.log(req.url, req.method);
    res.send('Welcome to the Airbnb API');

});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });

});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;