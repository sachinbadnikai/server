const bodyParser=require('body-parser');
const cors=require('cors');//used for angular and nodejs server is run different port so.
const winston=require('winston');//library used for uncaught exception and unhandled exception 
const express=require('express');//which returns function we call that expressconst.This is module
const app=express();//object of express store it in to app
const flash=require('connect-flash');

app.use(express.json());//middle ware
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(flash());//displaying for errors
require('./startup/logging')();//logging logic
require('./startup/routes')(app);//routes logic
require('./startup/db')();//database connection logic
//require('./startup/config')();//configuration logic
require('./startup/validation')();//validation logic

const port=process.env.PORT || 3000;//set environment variable to set alternate port automatically during production or deployement
app.listen(port,()=>winston.info(`listening on port ${port}`));//`` back tics for template string






