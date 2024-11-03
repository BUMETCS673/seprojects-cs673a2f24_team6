const SQL = require('../utils/SQL');

createRecord = (user_id, recordData) => {
  const {
    exercise_name,
    description,
    number_of_set,
    status,
    priority,
    start_time,
    end_time,
    total_time
  } = recordData;

  const sql = `
    INSERT INTO exercise_recording (
      user_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const value = [
    user_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
  ];

  // TODO: add more res detail
  return SQL.runsql(sql,value);
}

deleteRecord = (user_id, record_id) => {
  const sql = `DELETE FROM exercise_recording WHERE user_id = ? AND record_id = ?`;
  const value = [user_id, record_id];

  // TODO: add more res detail
  return SQL.runsql(sql,value);
}

updateRecord = (user_id, recordData) => {
  const {
    record_id,
    exercise_name,
    description,
    number_of_set,
    status,
    priority,
    start_time,
    end_time,
    total_time
  } = recordData;

  const sql = `
    UPDATE exercise_recording
    SET exercise_name = ?, description = ?, number_of_set = ?, status = ?, priority = ?, start_time = ?, end_time = ?, total_time = ?
    WHERE user_id = ? AND record_id = ?
  `;
  const value = [
    exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time, user_id, record_id
  ];

  // TODO: add more res detail
  return SQL.runsql(sql,value);
}

searchRecord = (user_id) => {
  const sql = `SELECT * FROM exercise_recording WHERE user_id = ?`;
  const value = [user_id];

  return SQL.runsql(sql,value);
}


module.exports = {createRecord, deleteRecord, updateRecord, searchRecord};