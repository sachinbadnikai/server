const winston=require('winston');
const mongoose=require('mongoose');
const config=require('../config/dev');
module.exports=function(){
    //database connection
mongoose.connect(config.DB_URI)
.then(()=>winston.info("connected to mongodb"));
} 