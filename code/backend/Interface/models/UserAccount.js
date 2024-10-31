// models/userAccount.model.js
const { runsql } = require('../utils/SQL');
const bcrypt = require('bcrypt');

class UserAccount {
    static async findByEmail(email) {
        const sql = 'SELECT * FROM user_account WHERE user_email = ?';
        const result = await runsql(sql, [email]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const sql = 'SELECT * FROM user_account WHERE user_name = ?';
        const result = await runsql(sql, [username]);
        return result.rows[0];
    }

    static async findById(userId) {
        const sql = 'SELECT user_id, user_email, user_name, user_group_id, user_role FROM user_account WHERE user_id = ?';
        const result = await runsql(sql, [userId]);
        return result.rows[0];
    }

    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const sql = `INSERT INTO user_account 
            (user_email, user_name, user_password, user_group_id, user_role) 
            VALUES (?, ?, ?, ?, ?)`;
        const values = [
            userData.email,
            userData.username,
            hashedPassword,
            userData.groupId || null,
            userData.role || null
        ];
        return await runsql(sql, values);
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE user_account SET user_password = ? WHERE user_id = ?';
        return await runsql(sql, [hashedPassword, userId]);
    }

    static async checkCredentials(identifier, password) {
        // Check if identifier is email or username
        const sql = 'SELECT * FROM user_account WHERE user_email = ? OR user_name = ?';
        const result = await runsql(sql, [identifier, identifier]);
        
        if (result.rows.length === 0) return null;
        
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.user_password);
        
        return isValid ? user : null;
    }
}

module.exports = UserAccount;