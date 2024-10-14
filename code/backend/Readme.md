# Backend Interface

Include A MYSQL database and a Express JS web API interface 

## Quick Setup

1. open a terminal
2. ``cd`` (For Linux and Windows) to the file of ``<youProjectLocation>\seprojects-cs673a2f24_team6\code\backend``
3. Make sure your Docker is running
4. Check the Port 3000 and 3001 is free
5. Run the command ``docker-compose up --build -d``
6. The backend is setup and you should see the backend show up at containers in docker
7. The backend interface should now open you ``localhost:3001`` or ``127.0.0.1:3001``
8. go to the web page of ``localhost:3001`` or ``127.0.0.1:3001``, you can see a JSON ``{test:"success"}``



## database

### MYSQL setup

**we will set up the database in the docker**

```shell
docker network create <network-name>
#setup a local network for docker

docker run --name <container-name> --network <network-name> -p <host-port>:3306 -e MYSQL_ROOT_PASSWORD=<password> -d mysql 
#set up the last version mysql
```

**Sample**

```shell
docker network create sample-network
#setup a local network for docker

docker run --name mysql --network sample-network -p 3000:3306 --restart always -e MYSQL_ROOT_PASSWORD=password -d mysql 
#set up the last version mysql at port 3000
```

**Fast reset**

```shell
docker stop 
docker rm sample-app
docker rmi sample-app

```





## Interface

### Docker setup

```shell
cd ~/ICSI499Project/database
#move to the database file, you should see a Dockerfile

docker build -t <interface-name> .
#using the dockerfile to build a image in docker

docker run --name <container-name> --network <network-name> -p <host-port>:3001 -d --restart always <interface-name>
#set up the interface at port 3001, now you access localhost:3001/ you should see a test:"success" which means success setup the interface server

```

**Sample**

```shell
docker build -t sample-app .
#using the dockerfile to build a image in docker

docker run --name sample-app --network sample-network -p 3001:3000 -d --restart always sample-app
#set up the interface at port 3001, now you access localhost:3001/ you should see a test:"success" which means success setup the interface server

```



### Config file



```json
{
    "connection":{
        "connectionLimit": 10,
        "host": "<container-name>", //mys
        "user": "root",
        "password": "<password>"
    },
    "database":"<database-name>",
    "table_name":[
        "<table-name>", //first table name
        "<table-name>"  //second table name
    ],
    "tables":[
        [ //first table
            "CREATE TABLE <table-name> ...",
            "ALTER TABLE <table-name> ...",
            "ALTER TABLE <table-name> ..."
        ],
        [ //second table
            "CREATE TABLE <table-name> ..."
        ]
    ]
    
}
```

**Sample**

```json
{
    "connection":{
        "connectionLimit": 10,
        "host": "sample-mysql",
        "user": "root",
        "password": "password"
    },
    "usertable": [
        "CREATE TABLE users (user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,user_name VARCHAR(50) NOT NULL,real_name VARCHAR(50),email VARCHAR(100) NOT NULL,location VARCHAR(200) NOT NULL,profile_img_id VARCHAR(100),bio TEXT,password VARCHAR(64) NOT NULL,has_items_list BOOLEAN NOT NULL DEFAULT false,other_info VARCHAR(200))",
        "ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email)",
        "ALTER TABLE users ADD CONSTRAINT check_password_length CHECK (LENGTH(password) = 64)"
    ],
    "itemtable":[
        "CREATE TABLE items (item_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,user_id INT NOT NULL,item_name VARCHAR(50) NOT NULL,item_keywords VARCHAR(200),item_location VARCHAR(200) NOT NULL,item_description TEXT,item_img_id VARCHAR(100),other_info VARCHAR(200))",
        "ALTER TABLE items ADD CONSTRAINT unique_item_name UNIQUE (user_id, item_name)",
        "ALTER TABLE items ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)"
    ],
    "keywordmaptable":[
        "CREATE TABLE keyword_map (keyword_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,keyword VARCHAR(20) NOT NULL,item_id INT NOT NULL)"
    ]
    
}
```



## Code

### basic router

**in the interface file**

```javascript
//import the two base packet
const express = require('express');
const router = express.Router();

//a basic get interface
router.get('/',(req,res)=>{res.json({test:"success"})});

//export the router to allow router to use it
//at the end of file
module.exports=router;
```

**in the router.js file**

```javascript
const express = require('express');
const router = express.Router();

//add interface here
const sample = require('./router/sample_router'); //load the interface file
router.use('/sample',sample); //use the interface and give a enterpoint

module.exports=router;
```



### router with database

**in the interface file**

```javascript
const express = require('express');
const router = express.Router();
const SQL = require('./SQLoperate') // import this file as database interface

//.... some other code

//sample of use interface 
router.get("/",(req,res)=>{
  var sql = "SELECT * FROM sample_table;"; //create a sql 

  //use the interface to run this sql and get result
  SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
  },(err)=>{
      res.status(400).json(err);
  })
});

//....

module.exports=router; //end file
```



### router with file access





































