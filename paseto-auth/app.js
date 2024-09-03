const express = require('express');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');
const verifyToken = require('./middleware/verifyToken');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.SECRET_KEY || !process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY) {
    throw new Error('Environment variables SECRET_KEY, PRIVATE_KEY, and PUBLIC_KEY must be set');
}

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/protected', verifyToken, protectedRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));