const crypto = require('crypto');
const bcrypt=require('bcrypt');
const _=require('lodash');
const {User,validate,}=require('../models/users');
const nodemailer=require('nodemailer');
const sendgridtransport=require('nodemailer-sendgrid-transport');
const config=require('../config/dev');
const randomstring=require('randomstring');

const transporter=nodemailer.createTransport(sendgridtransport({
  auth:{
      api_key:config.SEND_GRID_API
  }
}));
exports.register=async(req,res)=>{
    const {password,email,confirm}=req.body;

    //if invalid 404-bad equest
    if(!password || !email){
return res.status(422).send({error:[{title:'data is missing', details:'provide email and password'}]});
    }
    
    if(password !==confirm){
     return res.status(422).send({errors:[{title:'invalid password', details:'password is not same as a confirmation'}]});
            }
    const {error}=validate(req.body);//object destructuring
    if(error) return res.status(400).send(error.details[0].message);

    let user=await User.findOne({email})
    if(user) return res.status(400).send("user is already registered");

    // if(user.isCustomer===user.isVender) return res.status(400).send("user is register");
    // // if(user.isVender===true) return res.status(400).send("user is register");
    user=new User({
         name:req.body.name,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password,
        confirm:req.body.confirm,
        phoneno:req.body.phoneno,
        memberSince:req.body.memberSince,
        id:req.body.id,    
});
    // _.pick(req.body,['name','LastName','email','password','Phoneno','confirm','isAdmin','Term'])

    const salt=await bcrypt.genSalt(10);
    
         user.password= await bcrypt.hash(user.password,salt);
         user.confirm= await bcrypt.hash(user.confirm,salt);
        
         //generate the secret token
        const secretToken=randomstring.generate();
        // const active=false;
         user.secretToken=secretToken;
         //flag the account inactive
        //  user.active-active;


         await transporter.sendMail({
    
          to:req.body.email,
          from:'sachinbadnikai530@gmail.com',
          subject:'verify your email address',
          html: `
          <p>you need to veryfy email</p>
        <p>Click this link to verify your email<a href="http://localhost:3000/api/verify/${secretToken}">link</a></p>`
      });
    
         
    await user.save();
    
    const token=user.generateAuthToken();
    // const token=jwt.sign({_id:user._id},'jwtPrivateKey');
    //  res.header('x-auth-token',token).send(_.pick(user,['name','email']));
    res.header('Authorization',token).send({token});;
     res.status(200).send({token});
     res.send('email is sent');
   
     console.log(user.email);
   
}


exports.forgot = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            // req.flash('error', 'No account with that email found.');
            // return res.redirect('/reset');
            res.send('not an user')
          }
          transporter.sendMail({
            to: req.body.email,
            from: 'sachinbadnikai143@gmail.com',
            subject: 'Password reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/api/reset/${token}">link</a> to set a new password.</p>
            `
          });
          res.send('email is send please check your email');
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        // .then(result => {
        //   res.redirect('/');
        //   transporter.sendMail({
        //     to: 'sachinbadnikai530@gmail.com',
        //     from: 'sachinbadnikai143@gmail.com',
        //     subject: 'Password reset',
        //     html: `
        //       <p>You requested a password reset</p>
        //       <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        //     `
        //   });
        // })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
  };


 exports.reset= function(req, res) {
    User.findOne(function(err, user,next) {
      if (!user) {
      res.send("not an user");
      }
        var numSaltRounds = 10;
      const password=req.body.password;
      bcrypt.hash(password, numSaltRounds, function(err, hash) {
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
//  res.send("successfully changed");
   user.password=hash;
user.save();
  });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  
}


exports.passwordresetwithtoken  = async(req, res, next) => {
    const newPassword = req.body.password;
    //  const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
    //    _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        res.send('password reset successfully');
        return resetUser.save();
       
      })
    //   .then(result => {
    //     res.redirect('/login');
    //   })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  


//verify email
exports.verifyEmail=async (req,res,next)=>{
  try{
    const {secretToken}=req.body;
    //find accound that matches the secret tokens
      const user= await User.findOne({'secretToken':secretToken});
       if(!user) return res.status(400).send("no user found");
       await transporter.sendMail({
        to:user.email,
        from:'sachinbadnikai530@gmail.com',
        subject:'Email varification',
        html: ` <p>your email is verified</p> `
    });
       user.active=true;
       user.secretToken='';
       await user.save();
       res.send('you are now ready to login');
  }
  catch(error){
    next(error);
  }
    
}