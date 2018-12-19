const Joi=require('joi');//it returns class so name with pascal naming convension.this is module
module.exports=function(){
    Joi.objectId= require('joi-objectid')(Joi);
}