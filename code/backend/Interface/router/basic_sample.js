//import the two base packet
const express = require('express');
const router = express.Router();

//a basic get interface
router.get('/',(req,res)=>{res.json({test:"success"})});

//export the router to allow router to use it
module.exports=router;