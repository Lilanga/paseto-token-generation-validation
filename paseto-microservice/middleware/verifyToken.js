const { V4 } = require('paseto');
const tokenBlacklist = require('../utils/tokenBlacklist');

async function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Token has been invalidated' });
    }

    try {
        let payload;

        if (token.startsWith('v4.public.')) {
            const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n');
            payload = await V4.verify(token, publicKey);
        } else {
            throw new Error('Invalid token format');
        }

        if (new Date(payload.exp) < new Date()) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        req.userId = payload.userId;
        req.tokenType = payload.type;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = verifyToken;