// models/UserProfile.js
const SQL = require('../utils/SQL')

create = (profileData) => {
    const sql = `INSERT INTO user_profile 
        (user_id, first_name, last_name, avatar_url, introduction,
        height, weight, fitness_level, fitness_goals, birthday,
        training_start_date, phone, email, country, city, state) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        profileData.user_id,
        profileData.first_name,
        profileData.last_name,
        profileData.avatar_url,
        profileData.introduction,
        profileData.height,
        profileData.weight,
        profileData.fitness_level,
        profileData.fitness_goals,
        profileData.birthday,
        profileData.training_start_date,
        profileData.phone,
        profileData.email,
        profileData.country,
        profileData.city,
        profileData.state
    ];

    return SQL.runsql(sql, values);
};

findProfileByUserId = (userId) => {
    const sql = `
        SELECT p.*, u.user_name 
        FROM user_profile p
        JOIN user_account u ON p.user_id = u.user_id
        WHERE p.user_id = ?`;
    
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result.rows[0],
            (err) => err
        );
};

update = (userId, profileData) => {
    const sql = `UPDATE user_profile SET 
        first_name = ?,
        last_name = ?,
        avatar_url = ?,
        introduction = ?,
        height = ?,
        weight = ?,
        fitness_level = ?,
        fitness_goals = ?,
        birthday = ?,
        training_start_date = ?,
        phone = ?,
        email = ?,
        country = ?,
        city = ?,
        state = ?
        WHERE user_id = ?`;

    const values = [
        profileData.first_name,
        profileData.last_name,
        profileData.avatar_url,
        profileData.introduction,
        profileData.height,
        profileData.weight,
        profileData.fitness_level,
        profileData.fitness_goals,
        profileData.birthday,
        profileData.training_start_date,
        profileData.phone,
        profileData.email,
        profileData.country,
        profileData.city,
        profileData.state,
        userId
    ];

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

updateAvatar = (userId, avatarUrl) => {
    const sql = `UPDATE user_profile SET 
        avatar_url = ?
        WHERE user_id = ?`;

    return SQL.runsql(sql, [avatarUrl, userId])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

findByLocation = (country, state, city) => {
    let sql = `SELECT * FROM user_profile WHERE 1=1`;
    const values = [];

    if (country) {
        sql += ` AND country = ?`;
        values.push(country);
    }
    if (state) {
        sql += ` AND state = ?`;
        values.push(state);
    }
    if (city) {
        sql += ` AND city = ?`;
        values.push(city);
    }

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

module.exports = {
    create,
    findProfileByUserId,
    update,
    updateAvatar,
    findByLocation
};