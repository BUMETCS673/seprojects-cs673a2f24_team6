const UserAccount = require('../models/UserAccount');


create = (req, res) => {

  const { email, name, password } = req.body;

  // Validate input
  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields"
    });
  }

  // Create account
  UserAccount.create({
    email,
    name,
    password
  })
  .then(
    
    (result)=>{
      console.log("success create");
      res.status(200).json({"token":result.rows.insertId});
    },
    (err)=>{
      console.log("fall create");
      if(err.code == "ER_DUP_ENTRY") {
        res.status(400).json({"err":"user name or email already exist"});
      }else{
        res.status(400).json(err);
      }
    }
  )
}


login = (req,res) => {

  const { email, name, password } = req.query;

  // Validate input
  if((!email && !name) || !password){
    return res.status(400).json({err:"missing not null value"});
  }

  // check login type
  let identifier = ''
  let type = ''
  if(!email){
    type = 'username';
    identifier = name;
  }else{
    type = 'email';
    identifier = email;
  }

  // check password
  UserAccount.checkCredentials(identifier,password,type)
  .then(
    (result) => {
      if (result.err){
        return res.status(401).json(result);
      }
      console.log("success login");
      res.status(200).json(result);
    },
    (err) => {
      console.log("fall login");
      res.status(400).json(err);
    }
  )

}

//TODO: update password
updatePassword = (req,res) =>{
  const userId = req.user.id;
  const {currentPassword, newPassword} = req.body;

  if(!currentPassword || !newPassword){
    return res.status(400).json({err:"Missing required fields"});
  }

  UserAccount.updatePassword(userId, currentPassword, newPassword)
  .then(
    (result) => {
      if (result.err){
        return res.status(400).json(result);
      }
      console.log("success change password");
      res.status(200).json(result);
    },
    (err) => {
      console.log("fall change password");
      res.status(400).json(err);
    }
  )

}

deleteAccount = (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ err: "Password is required" });
  }

  UserAccount.findById(userId)
    .then(
      (user) => {
        if (!user) {
          return Promise.reject({ status: 404, message: "Account not found" });
        }
        return UserAccount.verifyPassword(userId, password);
      },
      (err) => Promise.reject({ status: 400, message: err })
    )
    .then(
      (isValid) => {
        if (!isValid) {
          return Promise.reject({ status: 401, message: "Invalid password" });
        }
        return UserAccount.deleteAccount(userId);
      },
      (err) => Promise.reject(err)
    )
    .then(
      () => {
        res.status(200).json({ msg: "Account deleted successfully" });
      }
    )
    .catch((err) => {
      const status = err.status || 400;
      const message = err.message || err;
      res.status(status).json({ err: message });
    });
};

module.exports = {create,login,updatePassword, deleteAccount};