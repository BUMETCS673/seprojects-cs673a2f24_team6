const jwt = require('jsonwebtoken');

// Load secrets and expiry times from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-token-secret';
const ACCESS_TOKEN_EXPIRY = '1h';  // Access token expiry time
const REFRESH_TOKEN_EXPIRY = '7d'; // Refresh token expiry time

// Generate an access token
function generateAccessToken(user) {
    return jwt.sign({
        id: user.id,
        loginTime: Date.now()
    }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

// Generate a refresh token
function generateRefreshToken(user) {
    return jwt.sign({
        id: user.id,
        loginTime: Date.now()
    }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

// Verify an access token
function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

// Verify a refresh token
function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};