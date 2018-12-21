const passportGoogle=require('../controller/passport-auth');
const express=require('express');
const router=express.Router();

   router.post('/google/:accessToken',passportGoogle.google);//controller passport-auth file
module.exports=router;