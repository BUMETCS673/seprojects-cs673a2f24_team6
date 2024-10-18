const express = require('express');
const router = express.Router();
const SQL = require('./SQLoperate')

// Create new record
router.post("/",(req,res)=>{
  if(!req.body.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.body.token;

  const {
    exercise_name,
    description,
    number_of_set,
    status,
    priority,
    start_time,
    end_time,
    total_time
  } = req.body;
  // TODO: check each params type and value

  const sql = `
    INSERT INTO exercise_recording (
      user_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const value = [
    user_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
  ];

  // TODO: add more res detail
  // run the sql via SQLoperate class
  SQL.runsql(sql,value).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })



})

// Delete record
router.delete("/",(req,res)=>{
  if(!req.query.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.query.token;

  const sql = `DELETE FROM exercise_recording WHERE user_id = ? AND record_id = ?`;
  const value = [user_id, req.query.record_id];

  // TODO: add more res detail
  // run the sql via SQLoperate class
  SQL.runsql(sql,value).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

})


// Modify record
router.put("/",(req,res)=>{
  if(!req.body.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.body.token;

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
  } = req.body;
  // TODO: check each params type and value

  const sql = `
    UPDATE exercise_recording
    SET exercise_name = ?, description = ?, number_of_set = ?, status = ?, priority = ?, start_time = ?, end_time = ?, total_time = ?
    WHERE user_id = ? AND record_id = ?
  `;
  const value = [
    exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time, user_id, record_id
  ];

  // TODO: add more res detail
  // run the sql via SQLoperate class
  SQL.runsql(sql,value).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })


})

// Search record
router.get("/",(req,res)=>{
  if(!req.query.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.query.token;

  const sql = `SELECT * FROM exercise_recording WHERE user_id = ?`;
  const value = [user_id];

  // TODO: add more res detail
  // run the sql via SQLoperate class
  SQL.runsql(sql,value).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
})

module.exports=router;