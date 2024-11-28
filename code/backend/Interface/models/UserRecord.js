const SQL = require('../utils/SQL');

createRecord = (user_id, recordData) => {
  const {
    exercise_id,
    description,
    number_of_set,
    status,
    priority,
    start_time,
    end_time,
    total_time
  } = recordData;

  const sql = `
    INSERT INTO workout_log (
      user_id, exercise_id, description, number_of_set, status, priority, start_time, end_time, total_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const value = [
    user_id, exercise_id, description, number_of_set, status, priority, start_time, end_time, total_time
  ];

  return SQL.runsql(sql,value)
            .then((result)=>{
              if(result.rows.affectedRows == 0){
                return {"err":"Record upload fail"};
              }
              return {"massage":"Record upload successfully"};
            },(err) => {
              console.log(err);
              if(err.errno == 1452){
                return {"err":"No such execise id"};
              }
              return {"err":"some error happen"};
            });
}

deleteRecord = (user_id, record_id) => {
  const sql = `DELETE FROM workout_log WHERE user_id = ? AND record_id = ?`;
  const value = [user_id, record_id];

  return SQL.runsql(sql,value)
            .then((result)=>{
              if(result.rows.affectedRows == 0){
                return {"err":"Record delete fail"};
              }
              return {"massage":"Record delete successfully"};
            },(err) => {
              console.log(err);
              return {"err":"some error happen"};
            });
}

updateRecord = (user_id, recordData) => {
  const {
    record_id,
    exercise_id,
    description,
    number_of_set,
    status,
    priority,
    start_time,
    end_time,
    total_time
  } = recordData;

  const sql = `
    UPDATE workout_log
    SET exercise_id = ?, description = ?, number_of_set = ?, status = ?, priority = ?, start_time = ?, end_time = ?, total_time = ?
    WHERE user_id = ? AND record_id = ?
  `;
  const value = [
    exercise_id, description, number_of_set, status, priority, start_time, end_time, total_time, user_id, record_id
  ];

  return SQL.runsql(sql,value)
            .then((result)=>{
              if(result.rows.affectedRows == 0){
                return {"err":"Record updated fail"};
              }
              return {"massage":"Record updated successfully"};
            },(err) => {
              console.log(err);
              if(err.errno == 1452){
                return {"err":"No such execise id"};
              }
              return {"err":"some error happen"};
            });
}

searchRecord = (user_id) => {
  const sql = `SELECT * FROM workout_log WHERE user_id = ?`;
  const value = [user_id];

  return SQL.runsql(sql,value)
            .then((result)=>result
            ,(err) => {
              console.log(err);
              return {"err":"some error happen"};
            });
}


module.exports = {createRecord, deleteRecord, updateRecord, searchRecord};