const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { runsql } = require('../utils/SQL');

// Secret keys for JWT and Refresh Tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-token-secret';

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [user] = await runsql(sql, [email]);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." });
        }

        const loginTime = Date.now();

        // Generate the short-lived access token (expires in 1 hour)
        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            loginTime: loginTime
        }, JWT_SECRET, { expiresIn: '1h' });

        // Generate the long-lived refresh token (expires in 7 days)
        const refreshToken = jwt.sign({
            id: user.id,
            email: user.email,
            loginTime: loginTime
        }, REFRESH_SECRET, { expiresIn: '7d' });

        // Send both tokens to the client (access token in JSON, refresh token as HTTP-only cookie)
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days in ms
        res.status(200).json({ message: "Login successful", accessToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error." });
    }
}

module.exports = {
    login,
    // other authentication functions...
};
