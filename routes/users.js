
const auth=require('../middelware/auth');
const users=require('../controller/users');
const bcrypt=require('bcrypt');
const _=require('lodash');
const {User,validate,}=require('../models/users');
const express=require('express');
const router=express.Router();


router.get('/me',async(req,res)=>{
   const user= await User.findById(req.user._id).select('-password');
   res.send(user);
});

router.get('/',async(req,res)=>{
    const user= await User.find().sort('name');
    res.send(user);
 });

   router.post('/users',users.register);//controller user file
   router.post('/forgot',users.forgot);
   router.post('/reset',users.reset);
   router.post('/reset/:token',users.passwordresetwithtoken);
   router.post('/verify/:secretToken',users.verifyEmail);


router.get('/:id',async(req,res)=>{
    try{
        ////look up the trainer
       const t=await User.findById(req.params.id);
       res.send(t);
    }
    //if not exists return 404 error
    catch(ex){
       res.status(404).send("The given trainer id was not found");
    }
});
// /* GET users listing. */
// router.get('/', ensureAuthenticated, function(req, res, next) {
//     res.render('user', { user: req.user });
//   });

//   function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) { return next(); }
//     res.redirect('/login')
//   }



module.exports=router;