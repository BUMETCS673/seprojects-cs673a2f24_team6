const SQL = require('../utils/SQL');

// Create new exercise
create = (exerciseData) => {
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

    return SQL.runsql(sql, values);
};

// Find exercise by ID
findById = (exerciseId) => {
    const sql = 'SELECT * FROM exercises WHERE exercise_id = ?';
    return SQL.runsql(sql, [exerciseId])
        .then(
            (result) => result.rows[0],
            (err) => err
        );
};

// Get all exercises for user
findAll = (userId) => {
    const sql = `
        SELECT * FROM exercises 
        WHERE user_id IS NULL OR user_id = ?
        ORDER BY name ASC`;
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

// Search exercises
search = (query, type, equipment, userId) => {
    let sql = `SELECT * FROM exercises WHERE (user_id IS NULL OR user_id = ?)`;
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

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

// Get exercise types
getTypes = () => {
    const sql = `
        SELECT DISTINCT type 
        FROM exercises 
        WHERE type IS NOT NULL 
        ORDER BY type`;
    return SQL.runsql(sql)
        .then(
            (result) => result.rows.map(row => row.type),
            (err) => err
        );
};
// get equipment list
getEquipmentList = () =>{
    const sql = `
        SELECT DISTINCT equipment 
        FROM exercises 
        WHERE equipment IS NOT NULL 
        ORDER BY equipment`;
    return SQL.runsql(sql)
        .then(
            (result) => result.rows.map(row => row.type),
            (err) => err
        );
}
// Update exercise
update = (exerciseId, updates) => {
    // Fields that are allowed to be updated
    const allowedFields = [
        'name', 
        'type', 
        'description', 
        'equipment', 
        'reps', 
        'sets', 
        'duration'
    ];

    // Filter out undefined values and non-allowed fields
    const validUpdates = Object.entries(updates)
        .filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    // If no valid updates, reject
    if (Object.keys(validUpdates).length === 0) {
        return Promise.reject("No valid fields to update");
    }

    // Create SET clause for SQL
    const setClause = Object.keys(validUpdates)
        .map(key => `${key} = ?`)
        .join(', ');

    const sql = `UPDATE exercises SET ${setClause} WHERE exercise_id = ?`;
    const values = [...Object.values(validUpdates), exerciseId];

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

// Delete exercise
deleteExercise = (exerciseId) => {
    const sql = 'DELETE FROM exercises WHERE exercise_id = ?';
    return SQL.runsql(sql, [exerciseId])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

module.exports = {
    create,
    findById,
    findAll,
    search,
    getTypes,
    getEquipmentList,
    update,
    delete: deleteExercise  // Export the delete function
};