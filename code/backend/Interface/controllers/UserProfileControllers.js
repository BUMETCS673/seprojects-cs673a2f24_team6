const UserProfile = require('../models/UserProfile')

updateProfile = (req, res) => {

  if(!req.body.token){
    res.status(400).json({err:"missing token"});
  }
  // TODO: check the token status and get user_id
  const user_id = req.body.token;

  // TODO: check each params type and value

  UserProfile.getProfile(user_id)
  .then((result)=>{
    if(result.rows.length == 0){
      UserProfile.createProfile(user_id, req.body)
      .then((result) => {
        res.status(200).json(result);
      },(err)=>{
        res.status(400).json(err);
      })
    }else{
      UserProfile.updateProfile(user_id, req.body)
      .then((result) => {
        res.status(200).json(result);
      },(err)=>{
        res.status(400).json(err);
      })
    }
  },(err)=>{
    res.status(400).json(err);
  })

}

getProfile = (req, res) => {

  if(!req.query.token){
    res.status(400).json({err:"missing token"});
  }
  // TODO: check the token status and get user_id
  const user_id = req.query.token;

  // TODO: check each params type and value

  UserProfile.getProfile(user_id)
  .then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
}

updateAvatar = (req, res) => {

  res.status(200).json({"success":"updateAvatar"});
}

getAvatar = (req, res) => {

  res.status(200).json({"success":"getAvatar"});
}

module.exports = {updateProfile, updateAvatar, getProfile, getAvatar}