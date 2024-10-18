const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_SESSION_TIME = 60 * 60 * 1000; // session expire time in hours
module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: "No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const loginTime = decoded.loginTime;
        console.log(`User loged in at: ${loginTime}`);
        const currentTime = new Date();
        const loginDateTime = new Date(loginTime);
        const timeDifference = currentTime - loginDateTime; // difference in milliseconds
        if (MAX_SESSION_TIME < timeDifference) {
            return res.status(401).json({ error: "session expired, login again." });
        }
        req.user = decoded; // Attach the decoded user info to the request object
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." });
    }
};
