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
    userData.username, 
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

// 




module.exports = {create, checkCredentials};