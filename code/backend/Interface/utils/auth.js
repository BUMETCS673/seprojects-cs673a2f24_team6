const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('./jwtUtils');  // Centralized JWT handling

// Secret key for JWT
const MAX_SESSION_TIME = 60 * 60 * 1000; // session expire time in milliseconds (1 hour)

// module.exports = (req, res, next) => {
//     const authHeader = req.headers['authorization'];

//     if (!authHeader) {
//         return res.status(403).json({ error: "No token provided." });
//     }

//     const token = authHeader.split(' ')[1];  // Strip 'Bearer ' from the token

//     try {
//         // Verify the token using centralized logic
//         const decoded = verifyAccessToken(token);
//         const loginTime = decoded.loginTime;

//         // Calculate time difference between now and the login time
//         const currentTime = Date.now();
//         const timeDifference = currentTime - loginTime;  // difference in milliseconds

//         if (timeDifference > MAX_SESSION_TIME) {
//             return res.status(401).json({ error: "Session expired, please log in again." });
//         }

//         req.user = decoded;  // Attach user info to the request object
//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ error: "Token expired, please log in again." });
//         }
//         return res.status(401).json({ error: "Invalid token." });
//     }
// };

module.exports = (req, res, next) => {
    const userId = req.query.userID || req.headers['x-user-id'];
    
    if (!userId) {
        return res.status(400).json({ err: "userID is required" });
    }

    // Set req.user with a mock user object based on the userID
    req.user = { id: userId, username: `User_${userId}` };
    next();
};