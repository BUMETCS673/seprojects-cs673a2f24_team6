const { runsql } = require('../utils/SQL');

class Exercise {
    static async create(exerciseData) {
        const sql = `INSERT INTO exercises 
            (name, description, equipment, type, reps, sets, duration, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            exerciseData.name,
            exerciseData.description,
            exerciseData.equipment,
            exerciseData.type,
            exerciseData.reps,
            exerciseData.sets,
            exerciseData.duration,
            exerciseData.user_id
        ];

        return await runsql(sql, values);
    }

    static async findById(exerciseId) {
        const sql = 'SELECT * FROM exercises WHERE exercise_id = ?';
        const result = await runsql(sql, [exerciseId]);
        return result.rows[0];
    }

    static async findAll(userId) {
        // Get both system exercises (user_id is null) and user's custom exercises
        const sql = `
            SELECT * FROM exercises 
            WHERE user_id IS NULL OR user_id = ?
            ORDER BY name ASC`;
        const result = await runsql(sql, [userId]);
        return result.rows;
    }

    static async findByType(type, userId) {
        const sql = `
            SELECT * FROM exercises 
            WHERE type = ? AND (user_id IS NULL OR user_id = ?)
            ORDER BY name ASC`;
        const result = await runsql(sql, [type, userId]);
        return result.rows;
    }

    static async findByUserId(userId) {
        // Get only user's custom exercises
        const sql = `
            SELECT * FROM exercises 
            WHERE user_id = ?
            ORDER BY name ASC`;
        const result = await runsql(sql, [userId]);
        return result.rows;
    }

    static async update(exerciseId, updateData) {
        const sql = `UPDATE exercises SET 
            name = ?,
            description = ?,
            equipment = ?,
            type = ?,
            reps = ?,
            sets = ?,
            duration = ?
            WHERE exercise_id = ?`;

        const values = [
            updateData.name,
            updateData.description,
            updateData.equipment,
            updateData.type,
            updateData.reps,
            updateData.sets,
            updateData.duration,
            exerciseId
        ];

        return await runsql(sql, values);
    }

    static async delete(exerciseId) {
        const sql = 'DELETE FROM exercises WHERE exercise_id = ?';
        return await runsql(sql, [exerciseId]);
    }

    static async search(query, type, equipment, userId) {
        let sql = `
            SELECT * FROM exercises 
            WHERE (user_id IS NULL OR user_id = ?)`;

        const values = [userId];

        if (query) {
            sql += ` AND (name LIKE ? OR description LIKE ?)`;
            const searchTerm = `%${query}%`;
            values.push(searchTerm, searchTerm);
        }

        if (type) {
            sql += ` AND type = ?`;
            values.push(type);
        }

        if (equipment) {
            sql += ` AND equipment = ?`;
            values.push(equipment);
        }

        sql += ` ORDER BY name ASC`;

        const result = await runsql(sql, values);
        return result.rows;
    }

    static async getTypes() {
        const sql = `
            SELECT DISTINCT type 
            FROM exercises 
            WHERE type IS NOT NULL 
            ORDER BY type`;
        const result = await runsql(sql);
        return result.rows.map(row => row.type);
    }

    static async getEquipment() {
        const sql = `
            SELECT DISTINCT equipment 
            FROM exercises 
            WHERE equipment IS NOT NULL 
            ORDER BY equipment`;
        const result = await runsql(sql);
        return result.rows.map(row => row.equipment);
    }

    static async validateExerciseOwnership(exerciseId, userId) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM exercises 
            WHERE exercise_id = ? AND user_id = ?`;
        const result = await runsql(sql, [exerciseId, userId]);
        return result.rows[0].count > 0;
    }
}

module.exports = Exercise;