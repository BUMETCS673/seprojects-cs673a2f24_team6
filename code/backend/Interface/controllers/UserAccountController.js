function check_null(value){
    if(value === null){
        return "null"
    }else{
        return "'" + value + "'";
    }
}

module.exports  = {
    get : (req,res)=>{
        // Check the body for user email, user name, and user password
        if((!req.query.email && !req.query.name) || !req.query.password){
          res.status(400).json({err:"missing not null value"});
        }
        var sql = ``;
        var value = [];

        // SQL inject protect by value
        if(!req.query.email){ // login with user name
          sql = `SELECT user_id FROM user_account WHERE user_name = ? and user_password = ?`;
          value = [req.query.name, req.query.password];
        }else{ // login with email
          sql = `SELECT user_id FROM user_account WHERE user_email = ? and user_password = ?`;
          value = [req.query.email, req.query.password];
        }


        // TODO: add more res detail
        // run the sql via SQLoperate class
        SQL.runsql(sql,value).then((result)=>{
          if(result.rows.length == 0){
            res.status(400).json({"err":"user or password error"});
          }else{
            res.status(200).json({"token":result.rows[0].user_id});
          }
        },(err)=>{
          res.status(400).json(err);
        })
    },

    post : (req,res)=>{
      // Check the body for user email, user name, and user password
      if(!req.body.email || !req.body.name || !req.body.password){
        res.status(400).json({err:"missing not null value"});
      }
      const{email, name, password} = req.body;
      // TODO: Check email format
      // TODO: Check email and username avalible or not
      // SQL inject protect by value
      // conver to sql
      const sql = `INSERT INTO user_account( user_email, user_name, user_password ) VALUES (?,?,?)`;
      const value = [email, name, password];
      // TODO: add more res detail
      // run the sql via SQLoperate class
      SQL.runsql(sql,value).then((result)=>{
        res.status(200).json({"token":result.rows.insertId});
      },(err)=>{
        res.status(400).json(err);
      })

    }

}