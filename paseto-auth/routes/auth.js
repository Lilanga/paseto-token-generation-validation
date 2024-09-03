const express = require('express');
const bcrypt = require('bcrypt');
const { createLocalToken, createPublicToken } = require('../utils/tokenUtils');
const verifyToken = require('../middleware/verifyToken');
const tokenBlacklist = require('../utils/tokenBlacklist');
const users = require('../data/users');

const router = express.Router();

// Login route with option to choose token type
router.post('/login', async (req, res) => {
    const { username, password, tokenType } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    let token;
    if (tokenType === 'public') {
        token = await createPublicToken(user.id);
    } else {
        token = await createLocalToken(user.id);
    }

    res.json({ token, tokenType });
});

// Refresh token route
router.post('/refresh', verifyToken, async (req, res) => {
    let newToken;
    if (req.tokenType === 'public') {
        newToken = await createPublicToken(req.userId);
    } else {
        newToken = await createLocalToken(req.userId);
    }
    res.json({ token: newToken, tokenType: req.tokenType });
});

// Logout route
router.post('/logout', verifyToken, (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    tokenBlacklist.add(token);
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;