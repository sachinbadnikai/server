const winston= require('winston');
require('winston-mongodb');
require('express-async-errors');
const config=require('../config/dev');

module.exports=function(){
    winston.handleExceptions(
        new winston.transports.Console({colorize:true,prettyPrint:true}),
        new winston.transports.File({filename:'uncaughtException.log'}));

  process.on('unhandledRejection',(ex)=>{
     throw ex;
  });
winston.add(winston.transports.File,{filename:'logfile.log'});
winston.add(winston.transports.MongoDB,{db:config.DB_URI,
level:'info'
});
      
}