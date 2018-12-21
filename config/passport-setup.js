const google=require('../config/dev');
var passport = require('passport');
const {User,}=require('../models/users');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const GooglePlusTokenStrategy=require('passport-google-plus-token');
const nodemailer=require('nodemailer');
const sendgridtransport=require('nodemailer-sendgrid-transport');
const config=require('../config/dev');
const randomstring=require('randomstring');



const transporter=nodemailer.createTransport(sendgridtransport({
  auth:{
      api_key:config.sendgrid.api_key
  }
}));


//google oauth stratergy

    passport.use('googleToken',new GooglePlusTokenStrategy({
        clientID: google.google.CLIENT_ID,
        clientSecret: google.google.CLIENT_SECRET,
    },async(accessToken,refreshToken,profile,done)=>{
        console.log('profile',profile);

         //generate the secret token
         const secretToken=randomstring.generate();
         // const active=false;
         User.secretToken=secretToken;
 
          await transporter.sendMail({
           to:profile.emails[0].value,
           from:'sachinbadnikai530@gmail.com',
           subject:'verify your email address',
           html: `
           <p>you need to veryfy email</p>
         <p>Click this link to verify your email<a href="http://localhost:3000/api/verify/${secretToken}">link</a></p>`
       });
     //check user already exists
        User.findOne({googleid:profile.id}).then((currentUser)=>{
            if(currentUser){
               console.log('user is ',currentUser);
            }
            else{
                new User({
                    name:profile.displayName,
                    googleid:profile.id,
                    email:profile.emails[0].value,
                    secretToken:secretToken

                }).save().then((newuser)=>{
                    console.log('new user created'+newuser);
                });
            }
        });

       
        
    }
));
