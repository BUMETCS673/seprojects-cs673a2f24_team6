// models/UserProfile.js
const SQL = require('../utils/SQL')

findProfileByUserId = (userId) => {
    const sql = `
        SELECT p.*, u.user_name, u.user_email 
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
        avatar_url = ?,
        introduction = ?,
        height = ?,
        weight = ?,
        fitness_level = ?,
        fitness_goals = ?,
        preferred_workout_time = ?
        WHERE user_id = ?`;

    const values = [
        profileData.avatar_url,
        profileData.introduction,
        profileData.height,
        profileData.weight,
        profileData.fitness_level,
        profileData.fitness_goals,
        profileData.preferred_workout_time,
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

findCurrentAvatar = (userId) => {
    const sql = 'SELECT avatar_url FROM user_profile WHERE user_id = ?';
    
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result.rows[0]?.avatar_url,
            (err) => err
        );
};

module.exports = {
    findProfileByUserId,
    update,
    updateAvatar,
    findCurrentAvatar
};