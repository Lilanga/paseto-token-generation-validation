const { V3, V4 } = require('paseto');

async function createLocalToken(userId) {
    const key = Buffer.from(process.env.SECRET_KEY, 'hex');
    const payload = {
        userId: userId,
        type: 'local',
        exp: (new Date(Date.now() + 3600000)).toISOString() // 1 hour expiration 
    };
    return await V3.encrypt(payload, key);
}

async function createPublicToken(userId) {
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    const payload = {
        userId: userId,
        type: 'public',
        exp: (new Date(Date.now() + 3600000)).toISOString() // 1 hour expiration 
    };
    return await V4.sign(payload, privateKey);
}

module.exports = { createLocalToken, createPublicToken };