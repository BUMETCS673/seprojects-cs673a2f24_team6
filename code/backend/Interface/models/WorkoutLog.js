const { runsql } = require('../utils/SQL');

// Define the functions first

async function createLog(logData) {
  const { exerciseId, userId, date, reps, sets, weight, duration, distance } = logData;

  const sql = `INSERT INTO workout_logs (exercise_id, user_id, date, reps, sets, weight, duration, distance) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  return await runsql(sql, [exerciseId, userId, date, reps || null, sets || null, weight || null, duration || null, distance || null]);
}

async function findAllLogs(userId) {
  const sql = `SELECT * FROM workout_logs WHERE user_id = ?`;
  return await runsql(sql, [userId]);
}

async function findLogById(id) {
  const sql = `SELECT * FROM workout_logs WHERE id = ?`;
  const [log] = await runsql(sql, [id]);
  return log;
}

async function deleteLog(id) {
  const sql = `DELETE FROM workout_logs WHERE id = ?`;
  return await runsql(sql, [id]);
}

// Export the functions
module.exports = {
  createLog,
  findAllLogs,
  findLogById,
  deleteLog
};
