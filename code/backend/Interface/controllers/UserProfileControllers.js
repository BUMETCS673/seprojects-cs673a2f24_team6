updateProfile = (req, res) => {

  res.status(200).json({"success":"updateProfile"});
}

updateAvatar = (req, res) => {

  res.status(200).json({"success":"updateAvatar"});
}

getProfile = (req, res) => {

  res.status(200).json({"success":"getProfile"});
}

getAvatar = (req, res) => {

  res.status(200).json({"success":"getAvatar"});
}

module.exports = {updateProfile, updateAvatar, getProfile, getAvatar}