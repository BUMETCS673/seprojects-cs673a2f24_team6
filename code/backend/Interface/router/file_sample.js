const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/',(req,res)=>{res.sendFile(path.join(__dirname,'../public/sample.html'))});

router.get('/image',(req,res)=>{
	let file;
	const address = "../public/sample.png";
	try{
	file = path.join(__dirname,address);
	//res.sendFile(file);
	} catch (err){
	res.send("no such file");
	}
	res.sendFile(file);

});

router.get('/video',(req,res)=>{

	let file;

  let dir = ""
	if(req.query.path){
		console.log(JSON.parse(req.query.path))
		JSON.parse(req.query.path).forEach(element => {
			dir = dir + element + "/";
		});
	};

	const address = "../public/" + dir + "sample.mp4";
  file = path.join(__dirname,address)
   
  const stat = fs.statSync(file);
  const fileSize = stat.size;
  const head = {
    'content-Length':fileSize,
    'content-Type':'video/mp4'
  }

  var stream = fs.createReadStream(file);
  res.writeHead(200, head);
  stream.pipe(res);

});

module.exports=router; 