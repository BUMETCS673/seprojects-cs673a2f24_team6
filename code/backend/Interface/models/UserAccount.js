// models/UserAccount.js
const SQL = require('../utils/SQL')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

findByEmail = (email) => {
    const sql = 'SELECT * FROM user_account WHERE user_email = ?';
    return SQL.runsql(sql, [email])
        .then(
            (result) => result.rows[0],
            (err) => err
        );
};

findByUsername = (username) => {
    const sql = 'SELECT * FROM user_account WHERE user_name = ?';
    return SQL.runsql(sql, [username])
        .then(
            (result) => result.rows[0],
            (err) => err
        );
};

findById = (userId) => {
    const sql = 'SELECT user_id, user_email, user_name, user_group_id, user_role FROM user_account WHERE user_id = ?';
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result.rows[0],
            (err) => err
        );
};

create = (userData) => {
    // TODO: Implement bcrypt when ready
    const hashPassword = userData.password;
    
    const sql = `INSERT INTO user_account 
        (user_email, user_name, user_password, user_group_id, user_role) 
        VALUES (?, ?, ?, ?, ?)`;
    
    const values = [
        userData.email,
        userData.username,
        hashPassword,
        userData.groupId || null,
        userData.role || null
    ];

    return SQL.runsql(sql, values);
};

updatePassword = (userId, newPassword) => {
    // TODO: Implement bcrypt when ready
    const hashPassword = newPassword;
    
    const sql = 'UPDATE user_account SET user_password = ? WHERE user_id = ?';
    return SQL.runsql(sql, [hashPassword, userId])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

checkCredentials = (identifier, password, type = 'email') => {
    const sql = type === 'email' 
        ? 'SELECT * FROM user_account WHERE user_email = ?'
        : 'SELECT * FROM user_account WHERE user_name = ?';
    
    return SQL.runsql(sql, [identifier])
        .then(
            (result) => {
                if (result.rows.length === 0) {
                    return { err: "no such user" };
                }

                const DBpassword = result.rows[0].user_password;
                if (DBpassword === password) {
                    return { userId: result.rows[0].user_id };
                } else {
                    return { err: "password error" };
                }
            },
            (err) => err
        );
};

module.exports = {
    findByEmail,
    findByUsername,
    findById,
    create,
    updatePassword,
    checkCredentials
};