const UserRecord = require('../models/UserRecord');

createRecord = (req, res) => {
  if(!req.body.token){
    res.status(400).json({err:"missing token"});
  }
  // TODO: check the token status and get user_id
  const user_id = req.body.token;
  
  // TODO: check each params type and value


  UserRecord.createRecord(user_id,req.body)
  .then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

}

deleteRecord = (req, res) => {
  if(!req.query.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.query.token;

  // TODO: check the record data type
  const record_id = req.query.record_id;

  UserRecord.deleteRecord(user_id, record_id)
  .then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

}

updateRecord = (req, res) => {
  if(!req.body.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.body.token;

  // TODO: check each params type and value

  UserRecord.updateRecord(user_id,req.body)
  .then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

}

searchRecord = (req, res) => {
  if(!req.query.token){
    res.status(400).json({err:"missing token"});
  }

  // TODO: check the token status and get user_id
  const user_id = req.query.token;

  UserRecord.searchRecord(user_id)
  .then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
}


module.exports = {createRecord, deleteRecord, updateRecord, searchRecord};