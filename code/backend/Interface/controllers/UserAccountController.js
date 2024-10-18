const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtUtils');
const SQL = require('../utils/SQL');  // Assuming you have SQL operations in utils
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-token-secret';

// Function to check for null values
function check_null(value) {
  return value === null ? "null" : `'${value}'`;
}

// Define the login (GET) function as async
async function get(req, res) {
  if ((!req.query.email && !req.query.name) || !req.query.password) {
    return res.status(400).json({ err: "Missing required values" });
  }

  let sql = ``;
  let value = [];

  if (!req.query.email) {
    // login with username
    sql = `SELECT user_id, user_password FROM user_account WHERE user_name = ?`;
    value = [req.query.name];
  } else {
    // login with email
    sql = `SELECT user_id, user_password FROM user_account WHERE user_email = ?`;
    value = [req.query.email];
  }

  try {
    const result = await SQL.runsql(sql, value);

    if (result.rows.length === 0) {
      return res.status(400).json({ err: "User not found" });
    }

    // Check if password matches
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(req.query.password, user.user_password);
    if (!isPasswordValid) {
      return res.status(401).json({ err: "Incorrect password" });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ id: user.user_id, email: req.query.email || req.query.name });
    const refreshToken = generateRefreshToken({ id: user.user_id, email: req.query.email || req.query.name });

    // Send refresh token as a secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
    return res.status(200).json({ accessToken });

  } catch (err) {
    return res.status(400).json(err);
  }
}

// Define the create user (POST) function as async
async function post(req, res) {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ err: "Missing required values" });
  }

  // Validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validateEmail(email)) {
    return res.status(400).json({ err: "Invalid email format" });
  }

  // Check if email or username is already in use
  const checkUserExist = async (email, name) => {
    const sql = `SELECT user_id FROM user_account WHERE user_email = ? OR user_name = ?`;
    const result = await SQL.runsql(sql, [email, name]);
    return result.rows.length > 0;
  }

  if (await checkUserExist(email, name)) {
    return res.status(400).json({ err: "Email or username already in use" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO user_account (user_email, user_name, user_password) VALUES (?,?,?)`;
    const value = [email, name, hashedPassword];

    const result = await SQL.runsql(sql, value);  // SQL operation to create a user
    return res.status(200).json({ userId: result.rows.insertId });  // Return the user ID

  } catch (err) {
    return res.status(400).json(err);
  }
}

// Refresh token handler
function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;  // Get the refresh token from the HTTP-only cookie

  if (!refreshToken) {
    return res.status(403).json({ error: "No refresh token provided." });
  }

  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken, REFRESH_SECRET);

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      loginTime: decoded.loginTime
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error during refresh token verification:", error);
    return res.status(403).json({ error: "Invalid refresh token." });
  }
}

// Export all functions
module.exports = { get, post, refreshToken };
