const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-token-secret';

function check_null(value) {
  return value === null ? "null" : `'${value}'`;
}

// Define the get function as async
async function get(req, res) {
  if ((!req.query.email && !req.query.name) || !req.query.password) {
    return res.status(400).json({ err: "missing not null value" });
  }

  let sql = ``;
  let value = [];

  if (!req.query.email) { // login with user name
    sql = `SELECT user_id FROM user_account WHERE user_name = ? AND user_password = ?`;
    value = [req.query.name, req.query.password];
  } else { // login with email
    sql = `SELECT user_id FROM user_account WHERE user_email = ? AND user_password = ?`;
    value = [req.query.email, req.query.password];
  }

  try {
    const result = await SQL.runsql(sql, value); // Use await for asynchronous SQL query
    if (result.rows.length === 0) {
      return res.status(400).json({ err: "user or password error" });
    } else {
      return res.status(200).json({ token: result.rows[0].user_id });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
}

// Define the post function as async
async function post(req, res) {
  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).json({ err: "missing not null value" });
  }

  const { email, name, password } = req.body;

  // Check email format
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
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO user_account (user_email, user_name, user_password) VALUES (?,?,?)`;
    const value = [email, name, hashedPassword];

    const result = await SQL.runsql(sql, value); // Use await for the SQL query
    return res.status(200).json({ token: result.rows.insertId });
  } catch (err) {
    return res.status(400).json(err);
  }
}

function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken; // Get the refresh token from the HTTP-only cookie

  if (!refreshToken) {
    return res.status(403).json({ error: "No refresh token provided." });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign({
      id: decoded.id,
      email: decoded.email,
      loginTime: decoded.loginTime
    }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error during refresh token verification:", error);
    return res.status(403).json({ error: "Invalid refresh token." });
  }
}

// Export both functions together
module.exports = { get, post, refreshToken };
