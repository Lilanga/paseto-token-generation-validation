const express = require('express');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/verifyToken');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.PUBLIC_KEY) {
    throw new Error('PUBLIC_KEY environment variable is not set');
}

const app = express();
app.use(express.json());

// Routes
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.userId, tokenType: req.tokenType });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.EXT_PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));