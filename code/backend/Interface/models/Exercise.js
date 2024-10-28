const { runsql } = require('../utils/SQL');

// Exercise Model
module.exports = {
  create: async (exerciseData) => {
    const { name, type, duration, userId } = exerciseData;

    const sql = `INSERT INTO exercises (name, type, duration) VALUES (?, ?, ?)`;
    return await runsql(sql, [name, type, duration || null, userId]);
  },

  findAll: async (userId) => {
    const sql = `SELECT * FROM exercises WHERE user_id = ?`;
    return await runsql(sql, [userId]);
  },

  findById: async (id) => {
    const sql = `SELECT * FROM exercises WHERE id = ?`;
    const [exercise] = await runsql(sql, [id]);
    return exercise;
  },

  delete: async (id) => {
    const sql = `DELETE FROM exercises WHERE id = ?`;
    return await runsql(sql, [id]);
  }
};
