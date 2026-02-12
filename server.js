const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

connectDB();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors()); // Allow all origins for development to fix CORS issues

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for development - use 100 in production
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const branchRoutes = require('./routes/branchRoutes');
const menuRoutes = require('./routes/menuRoutes');
const branchManagerRoutes = require('./routes/branchManagerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const smsRoutes = require('./routes/smsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/menu-items', menuRoutes);
app.use('/api/branch-manager', branchManagerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', invoiceRoutes); // Invoice generation route (uses /api/orders/:id/invoice)
app.use('/api/revenue', revenueRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sms', smsRoutes);

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api', (req, res) => {
    res.send('API is running...');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}).on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
});
