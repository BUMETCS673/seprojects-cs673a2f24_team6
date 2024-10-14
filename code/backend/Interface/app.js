const express = require('express');
const app = express();
const router = require('./router');
const SQL = require('./router/SQLoperate');
const cors = require('cors');

//setup the sql connection
// SQL.runsql('SELECT now()').then((res)=>{
//     console.log(res);
// },(err)=>{
//     console.log(err);
// });

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/',(req,res)=>{res.json({test:"success"})});

app.use('/',router);

app.listen(3000,()=>{console.log("server run at port 3000")});