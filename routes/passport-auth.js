const passportGoogle=require('../controller/passport-auth');
const express=require('express');
const router=express.Router();

   router.post('/google',passportGoogle.google);//controller passport-auth file
   router.post('/facebook',passportGoogle.facebook);//controller passport-auth file
module.exports=router;