const jwt=require('jsonwebtoken');
const Joi=require('joi');
// const config=require('config');
const mongoose=require('mongoose');
const config=require('../config/dev');

const userSchema=new mongoose.Schema(
    {        
         name: {type: String},
         lastName:{type:String},
         phoneno:{type: String},
         password: String,
        // confirm:String,
         email: {type: String, unique: true},
         term:{type:String},
         secretToken:String,
         active:{type: Boolean, default: false},
         resetToken: String,
         resetTokenExpiration: Date,
         isAdmin: {type: Boolean, default: false},
         memberSince : {type : Date, default : Date.now},
         googleid:String,
         facebookid:String
     });
           userSchema.methods.generateAuthToken=function(){
           const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.SECRET, {
                          expiresIn: 60 * 120
                 });
           return token;
}

   
const User=mongoose.model('user',userSchema);

   function validateUser(User){
    const schema={
            name:Joi.string().required().min(3).max(50),
           lastName:Joi.string(),
           email:Joi.string().email().required(),
           password:Joi.string().min(5).max(255),
           confirm:Joi.string().min(5).max(255),
           phoneno:Joi.string().required().min(10),
           isAdmin:Joi.boolean(),
           memberSince:Joi.date(),
       };
       return Joi.validate(User,schema);
   }

   module.exports.User=User;
   module.exports.validate=validateUser;
   module.exports.userSchema=userSchema;