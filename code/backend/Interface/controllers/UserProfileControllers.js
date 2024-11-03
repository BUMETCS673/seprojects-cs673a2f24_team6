const UserProfile = require('../models/UserProfile')
const path = require('path');
const fs = require('fs');


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
  const user_id = req.query.token;

  const fileName = user_id + '.jpg';
	const filePath = '../public/avatar';

  let file = path.join(__dirname,filePath,fileName);

  fs.access(file,fs.constants.F_OK, (err) => {

		if(err){
			return res.status(404).json({err:"no such file"});
		}

		res.sendFile(file);
	})
}

module.exports = {updateProfile, updateAvatar, getProfile, getAvatar}