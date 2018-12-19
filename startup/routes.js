const error=require('../middelware/error');
const express=require('express');
const food=require('../routes/r-food');
const user=require('../routes/users');
const auth=require('../routes/auth');
//customer forgot and reset password
 const forgots=require('../routes/users');
const resets=require('../routes/users');
const verifyEmail=require('../routes/users');

module.exports=function(app){
    //api reference to the routes
    app.use(express.json());//middle ware
 app.use('/api/food',food);
  app.use('/api',user);
  //customer authentication
 app.use('/api/auth',auth);
 //customer forgot and reset password
 app.use('/api',forgots);
 app.use('/api',resets);
 app.use('/api',verifyEmail);
 app.use(error);
 

}