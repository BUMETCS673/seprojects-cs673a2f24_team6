const { runsql } = require('../utils/SQL');

class UserProfile {
    static async create(profileData) {
        const sql = `INSERT INTO user_profile 
            (user_id, avatar_url, introduction, height, weight, 
            fitness_level, fitness_goals, preferred_workout_time) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            profileData.user_id,
            profileData.avatar_url,
            profileData.introduction,
            profileData.height,
            profileData.weight,
            profileData.fitness_level,
            profileData.fitness_goals,
            profileData.preferred_workout_time
        ];
        return await runsql(sql, values);
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT p.*, u.user_name, u.user_email 
            FROM user_profile p
            JOIN user_account u ON p.user_id = u.user_id
            WHERE p.user_id = ?`;
        const result = await runsql(sql, [userId]);
        return result.rows[0];
    }

    static async update(userId, profileData) {
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
        return await runsql(sql, values);
    }
}

module.exports = UserProfile;