const SQL = require('../utils/SQL');

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

getEquipmentList = () =>{
    const sql = `
        SELECT DISTINCT equipment 
        FROM exercises 
        WHERE equipment IS NOT NULL 
        ORDER BY equipment`;
    return SQL.runsql(sql)
        .then(
            (result) => result.rows.map(row => row.equipment),
            (err) => err
        );
}

findAll = () => {
    const sql = `
        SELECT * FROM exercises
        ORDER BY name ASC`;
    return SQL.runsql(sql, [])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

findByType = (type) => {
    let sql = `
        SELECT * FROM exercises 
        WHERE type = ?
        ORDER BY name ASC`;
    const values = [type];

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

findByEquipment = (equipment) => {
    let sql = `
        SELECT * FROM exercises 
        WHERE equipment = ?
        ORDER BY name ASC`;
    const values = [equipment];

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

findById = (id) => {
    let sql = `
        SELECT * FROM exercises 
        WHERE exercise_id = ?`;
    const values = [id];

    return SQL.runsql(sql, values)
        .then(
            (result) => result.rows,
            (err) => err
        );
};

create = (exerciseData) => {
    const sql = `INSERT INTO exercises 
        (name, description, equipment, type, url) 
        VALUES (?, ?, ?, ?, ?)`;

    const values = [
        exerciseData.name,
        exerciseData.description,
        exerciseData.equipment,
        exerciseData.type,
        exerciseData.url
    ];

    return SQL.runsql(sql, values)
        .then(
            (result) => {
                if(result.rows.affectedRows == 0){
                    return {"err":"exercise create fail"};
                  }
                  return {"massage":"exercise create successfully"};
            },
            (err) => err
        );
};

deleteExercise = (exerciseId) => {
    const sql = 'DELETE FROM exercises WHERE exercise_id = ?';
    return SQL.runsql(sql, [exerciseId])
        .then(
            (result) => {
                if(result.rows.affectedRows == 0){
                    return {"err":"exercise create fail"};
                  }
                  return {"massage":"exercise create successfully"};
            },
            (err) => err
        );
};

module.exports = {
    getTypes,
    getEquipmentList,
    findAll,
    findByType,
    findByEquipment,
    findById,
    create,
    deleteExercise
};