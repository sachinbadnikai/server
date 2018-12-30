const passportGoogle=require('../controller/passport-auth');
const passportFacebook=require('../controller/passport-auth');
const express=require('express');
const router=express.Router();

   router.post('/google',passportGoogle.google);//controller passport-auth file
   router.post('/facebook',passportFacebook.facebook);//controller passport-auth file
module.exports=router;