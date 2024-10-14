const mysql = require('mysql2');
const config = require('../config/database.json')

// create the connection to database
let pool = mysql.createPool(config.connection);

async function runsql(sql){
    
    return new Promise((resolve, reject)=>{
      pool.getConnection((err,connection)=>{
        if(err){
          connection.release();
          reject(err);
        } 
        connection.query(sql,(err,rows)=>{
          connection.release();
          if(err) reject(err);
          resolve({rows:rows});
        })
      })
      // con.query(sql, (err, result) =>{
      //   if(err) reject('err');
      //   resolve(result);
      // })
    })
}

function creatTable(){
  const tables = [];
  const alter = [];

  config.tables.forEach(
    (table)=>{
      tables.push(runsql(table[0]));
    }
  )
  
  

  Promise.all(tables).then((res)=>{
      console.log(res)
      
      config.tables.forEach(
        (table)=>{
          if(table.length > 1){
            for(i=1;i<table.length;i++){
              alter.push(runsql(table[i]));
            }
          }
        }
      )
      
      Promise.all(alter).then((res)=>{
          console.log("successful creat table and alter")
      }).catch((err)=>{
          console.log("creat table success, but add alter fail")
          console.log(err)
      })
  }).catch((err)=>{
      console.log("creat table fail");
      console.log(err);
  })


}

function checkTable(){
  config.table_name.forEach((table)=>{
    var sql = "show tables like '" + table + "';";
    runsql(sql).then((res)=>{
      console.log(res.rows)
      if(res.rows.length > 0){
        console.log("table " + table + " pass check");
      }else{
        console.log("table " + table + " not pass check");
        creatTable();
      }
    },(err)=>{
      console.log(err);
    })
  })
  
}

pool.getConnection((err,connection)=>{
    if(err){
      // connection.release();
      console.log("fail to connect")
    } 
    connection.query("USE "+config.database,(err,res)=>{
      connection.release();
      if(err){
        runsql("CREATE DATABASE "+config.database).then((res)=>{
            console.log("creat database success");
            let newconnect = config.connection;
            newconnect.database = config.database;
            const connection = newconnect;
            pool = mysql.createPool(connection);
            creatTable();
        },(err)=>{
            console.log("creat database fail");
        })
      }
      if(res){
        console.log("use database "+config.database);
        let newconnect = config.connection;
        newconnect.database = config.database;
        const connection = newconnect;
        pool = mysql.createPool(connection);
        checkTable();
      }
    })
})

// export the executeQuery function so other code can use it
module.exports = { runsql };
