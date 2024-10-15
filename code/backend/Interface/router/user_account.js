const express = require('express');
const router = express.Router();
const SQL = require('./SQLoperate')

function check_null(value){
  if(value === null){
      return "null"
  }else{
      return "'" + value + "'";
  }
}

// Create new account
router.post("/account",(req,res)=>{
  
  // Check the body for user email, user name, and user password
  if(!req.body.email || !req.body.name || !req.body.password){
    res.status(400).json({err:"missing not null value"});
  }

  // TODO: Check email format

  // TODO: Check email and username avalible or not

  // TODO: add SQL inject protect
  // conver to sql
  var sql = "INSERT INTO user_account( user_email, user_name, user_password ) VALUES (";
  sql = sql + check_null(req.body.email) + ",";
  sql = sql + check_null(req.body.name) + ",";
  sql = sql + check_null(req.body.password) + ");";

  // TODO: add more res detail
  // run the sql via SQLoperate class
  SQL.runsql(sql).then((result)=>{
    res.status(200).json({"token":result.rows.insertId});
  },(err)=>{
    res.status(400).json(err);
  })
  
});


// Login account
router.get("/account",(req,res)=>{
  // Check the body for user email, user name, and user password
  if((!req.query.email && !req.query.name) || !req.query.password){
    res.status(400).json({err:"missing not null value"});
  }

  // TODO: Check email format

  var sql = "SELECT user_id FROM user_account WHERE "

  // TODO: add SQL inject protect
  if(!req.query.email){ // login with user name
    var sql = sql + "user_name = " + check_null(req.query.name);
  }else{ // login with email
    var sql = sql + "user_email = " + check_null(req.query.email);
  }

  sql = sql + " and user_password = " + check_null(req.query.password) + ";";

  // TODO: add more res detail
  // run the sql via SQLoperate class
  SQL.runsql(sql).then((result)=>{

    res.status(200).json({"token":result.rows[0].user_id});
  },(err)=>{
    res.status(400).json(err);
  })

})


module.exports=router;