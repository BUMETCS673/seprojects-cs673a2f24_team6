const express = require('express');
const router = express.Router();
const path = require('path');
const SQL = require('./SQLoperate')

function check_null(value){
  if(value === null){
      return "null"
  }else{
      return "'" + value + "'";
  }
}

// Add data
router.post("/new",(req,res)=>{
  if(!req.body.value){
    res.status(400).json({err:"missing not null value"});
  }else{
    // load the data from body to data hashmap
    var Data = {};
    Data.value = req.body.value;
    
    // conver to sql
    var sql = "INSERT INTO sample_table( value ) VALUES (";
    sql = sql + check_null(Data.value) + ");";

    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
});

// Delete data
router.delete("/:id",(req,res)=>{

  var sql = "DELETE FROM sample_table WHERE ";
  sql = sql + "id = " + req.params.id + ";";

  SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
  },(err)=>{
      res.status(400).json(err);
  })
  
});

// Edit data
router.put("/:id",(req,res)=>{
  if(!req.body.value){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "UPDATE sample_table SET ";
    sql = sql +"value ="+ check_null(req.body.value) + " WHERE ";
    sql = sql + "id = " + req.params.id + " ;";
    
    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }

})

// search data (by last 10 id)
router.get("/",(req,res)=>{
  var sql = "SELECT * FROM sample_table ORDER BY id DESC LIMIT 10;";

  SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
  },(err)=>{
      res.status(400).json(err);
  })
});


// search data (by id)
router.get("/id/:Id",(req,res)=>{
  var sql = "SELECT * FROM sample_table WHERE id = " + req.params.Id + ";";

  SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
  },(err)=>{
      res.status(400).json(err);
  })
});

// search data (by value)
router.get("/value",(req,res)=>{
  if(!req.body.value){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "SELECT * FROM sample_table WHERE value = '" + req.body.value + "';";
  
    SQL.runsql(sql).then((result)=>{
        res.status(200).json(result);
    },(err)=>{
        res.status(400).json(err);
    })
  }
  
});

module.exports=router;