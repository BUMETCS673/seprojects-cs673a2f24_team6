const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { runsql } = require('../utils/SQL');

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Export the function
module.exports = {
    login,

};
