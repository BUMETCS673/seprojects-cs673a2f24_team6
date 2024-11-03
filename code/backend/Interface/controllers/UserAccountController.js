const UserAccount = require('../models/UserAccount');


create = (req, res) => {

  const { email, username, password } = req.body;

  // Validate input
  if (!email || !username || !password) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields"
    });
  }

  // Create account
  UserAccount.create({
    email,
    username,
    password
  })
  .then(
    (result)=>{
      console.log("success create");
      res.status(200).json({"Token":result.rows.insertId});
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
    res.status(400).json({err:"missing not null value"});
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
      console.log("success login");
      res.status(200).json(result);
    },
    (err) => {
      console.log("fall login");
      res.status(400).json(err);
    }
  )

}



module.exports = {create,login};