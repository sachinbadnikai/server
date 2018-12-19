const Joi=require('joi');
const mongoose=require('mongoose');

const foo=mongoose.model('food',new mongoose.Schema(
    {        
      image:String,  
      name: String                                                 
   }));


   function validateFood(foo){
    const schema={
         image:Joi.string(),
        name:Joi.string()
       };
       return Joi.validate(foo,schema);
   }


   module.exports.foo=foo;
   module.exports.validate=validateFood;