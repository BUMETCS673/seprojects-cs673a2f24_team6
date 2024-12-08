const express = require('express');
const app = express();
const router = require('./router');
const SQL = require('./utils/SQL');
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/',(req,res)=>{res.json({test:"success"})});

app.use('/api',router);

app.listen(3000,()=>{console.log("server run at port 3000")});