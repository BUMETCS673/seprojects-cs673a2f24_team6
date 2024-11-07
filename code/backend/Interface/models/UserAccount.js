const SQL = require('../utils/SQL')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// Create new account
create = (userData) => {

  // bcrypt

  const hashPassword = userData.password;

  const sql = `INSERT INTO user_account( user_email, user_name, user_password ) VALUES (?,?,?)`;
  const values = [
    userData.email, 
    userData.name, 
    hashPassword];

  return SQL.runsql(sql, values);
}

// Login account
checkCredentials = (identifier, password, type) => {
  // bcrypt password

  let sql = ''
  if(type == 'email'){
    sql = `SELECT user_id, user_password FROM user_account WHERE user_email = ?`;
  }else{
    sql = `SELECT user_id, user_password FROM user_account WHERE user_name = ?`;
  }

  const values = [identifier];

  return SQL.runsql(sql, values)
            .then((result) => {

              if (result.rows.length === 0){
                return {"err":"no such user"};
              }

              const DBpassword = result.rows[0].user_password;
              if(DBpassword == password){
                return {"token":result.rows[0].user_id};
              }else{
                return {"err":"password error"};
              }
            },(err) => err)
}

// update password
updatePassword = (userId, newPassword) => {
  // TODO: Implement bcrypt when ready
  const hashPassword = newPassword;
  
  const sql = 'UPDATE user_account SET user_password = ? WHERE user_id = ?';
  return SQL.runsql(sql, [hashPassword, userId])
      .then(
          (result) => result.rows,
          (err) => err
      );
};
// 

findByEmail = (email) => {
  const sql = 'SELECT * FROM user_account WHERE user_email = ?';
  return SQL.runsql(sql, [email])
      .then(
          (result) => result.rows[0],
          (err) => err
      );
};

findByUsername = (username) => {
  const sql = 'SELECT * FROM user_account WHERE user_name = ?';
  return SQL.runsql(sql, [username])
      .then(
          (result) => result.rows[0],
          (err) => err
      );
};

findById = (userId) => {
  const sql = 'SELECT user_id, user_email, user_name, user_group_id, user_role FROM user_account WHERE user_id = ?';
  return SQL.runsql(sql, [userId])
      .then(
          (result) => result.rows[0] || null,
          (err) => err
      );
};

findById = (userId) => {
  const sql = 'SELECT user_id, user_email, user_name, user_group_id, user_role FROM user_account WHERE user_id = ?';
  return SQL.runsql(sql, [userId])
    .then(
      (result) => result.rows[0] || null,
      (err) => err
    );
};

verifyPassword = (userId, password) => {
  const sql = 'SELECT user_password FROM user_account WHERE user_id = ?';
  return SQL.runsql(sql, [userId])
    .then(
      (result) => {
        if (!result.rows[0]) {
          return false;
        }
        return result.rows[0].user_password === password;
      },
      (err) => err
    );
};

deleteAccount = (userId) => {
  const sql = 'DELETE FROM user_account WHERE user_id = ?';
  return SQL.runsql(sql, [userId])
    .then(
      (result) => result.rows,
      (err) => err
    );
};


module.exports = {create, checkCredentials,updatePassword,findByEmail,findById,findByUsername, deleteAccount, verifyPassword};