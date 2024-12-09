const UserProfile = require('../models/UserProfile')
const path = require('path');
const fs = require('fs');


updateProfile = (req, res) => {
  
  const user_id = req.user.id;

  // TODO: check each params type and value

  UserProfile.getProfile(user_id)
  .then((result)=>{
    if(!result){
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

  const user_id = req.user.id;

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
  const user_id = req.user.id;

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