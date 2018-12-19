var express = require("express");
var router  = express.Router();
var passport = require("passport");
// var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var mongoose = require("mongoose");
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema(
    {        
        name: {type: String, unique: true},
        password: String,
        confirm:String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
   // //      avatar: String,
   // //      firstName: String,
   // //      lastName: String,
         email: {type: String, unique: true, required: true},
        //  resetPasswordToken: String,
        //  resetPasswordExpires: Date,
         isAdmin: {type: Boolean, default: false} 
        
        });

             const User=mongoose.model('users',userSchema);


router.post('/', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          // var token = buf.toString('hex');
          done(err);
        });
      },
      function( done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            // req.flash('error', 'No account with that email address exists.');
          //   return res.redirect('/forgot');
          res.send("not an user");
          }
  
          // user.resetPasswordToken = token;
          // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, user);
          });
        });
      },
      function( user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          secure:false,
          auth: {
            user: 'sachinbadnikai143@gmail.com',
            pass: 'Sachin143@'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'sachinbadnikai143@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://localhost:4200/customer/resetpassword/' +  '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
        // var data='Email is sent to your email';
        // storage = JSON.parse(data);
           res.send('An e-mail has been sent to ' + user.email + ' with further instructions.');
          // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      // res.redirect('/forgot');
      req.send("error in sending email");
    });
  });

router.get('/', function(req, res) {
  User.findOne( function(err, user) {
    if (!user) {
        res.send("not a valid token");
    //   req.flash('error', 'Password reset token is invalid or has expired.');
    //   return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/password', function(req, res) {
    User.findOne(function(err, user,next) {
      if (!user) {
      res.send("not an user");
      }
        var numSaltRounds = 10;
      const password=req.body.password;
bcrypt.hash(password, numSaltRounds, function(err, hash) {
 user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
//  res.send("successfully changed");
user.password=hash;
user.save();
  });
    });
  
});


router.get("/", function(req, res){
  req.logout();
  console.log("logout success");
  // req.flash("success", "See you later!");
   res.redirect("/login");
});



module.exports = router;