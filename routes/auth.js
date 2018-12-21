const config=require('../config/dev');
const jwt=require('jsonwebtoken');
const Joi=require('joi');
const bcrypt=require('bcrypt');
const _=require('lodash');
const {User,}=require('../models/users');
const express=require('express');
const router=express.Router();
const nodemailer=require('nodemailer');
const sendgridtransport=require('nodemailer-sendgrid-transport');

const transporter=nodemailer.createTransport(sendgridtransport({
  auth:{
      api_key:'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'
  }
}));

router.post('/',async(req,res)=>{
    const {error}=validate(req.body);//object destructuring
    //if invalid 404-bad equest
    if(error) return res.status(400).send(error.details[0].message);

    let user=await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("user email or password is invalid");
    
    if(!user.active) return res.status(400).send("you need to verify email first");

    const validPassword= await bcrypt.compare(req.body.password,user.password)
     if(!validPassword) return res.status(400).send("user email or password is invalid");
     
     
     //const token=user.generateAuthToken();
     const token=jwt.sign({_id:user._id,isAdmin:user.isAdmin},config.SECRET);
     res.send({token});
  
    
});

function validate(req){
    const schema={
        email:Joi.string().min(3).max(255).required().email(),
        password:Joi.string().min(3).max(255).required()
       };
       return Joi.validate(req,schema);
   }

module.exports=router;