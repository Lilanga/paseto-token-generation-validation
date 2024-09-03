const express = require('express');
const router = express.Router();

// Protected route example
router.get('/', (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.userId, tokenType: req.tokenType });
});

module.exports = router;