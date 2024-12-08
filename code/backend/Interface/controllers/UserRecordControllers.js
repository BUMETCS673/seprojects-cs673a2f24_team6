const UserRecord = require('../models/UserRecord');

createRecord = (req, res) => {
  const user_id = req.user.id;
  
  // TODO: check each params type and value


  UserRecord.createRecord(user_id,req.body)
  .then((result)=>{
    if (result.err){
      return res.status(400).json(result);
    } 
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

}

deleteRecord = (req, res) => {

  const user_id = req.user.id;

  // TODO: check the record data type
  const record_id = req.query.record_id;

  UserRecord.deleteRecord(user_id, record_id)
  .then((result)=>{
    if (result.err){
      return res.status(400).json(result);
    } 
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

}

updateRecord = (req, res) => {

  const user_id = req.user.id;

  // TODO: check each params type and value

  UserRecord.updateRecord(user_id,req.body)
  .then((result)=>{
    if (result.err){
      return res.status(400).json(result);
    } 
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

}

searchRecord = (req, res) => {

  const user_id = req.user.id;

  UserRecord.searchRecord(user_id)
  .then((result)=>{
    if (result.err){
      return res.status(400).json(result);
    } 
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
}


module.exports = {createRecord, deleteRecord, updateRecord, searchRecord};