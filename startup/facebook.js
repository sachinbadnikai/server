var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const express=require('express');//which returns function we call that expressconst.This is module
const app=express();//object of express store it in to app

const cors=require('cors');
app.use(cors());
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');



//facebook authentication
var passportConfig = require('../token-validation/token');
//  var passportConfigs = require('./token-validation/vender_token');
passportConfig();
// passportConfigs();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({
  exposedHeaders: ['x-auth-token']
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var createToken = function (auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
    {
      expiresIn: 60 * 120
    });
};

var generateToken = function (req, res, next) {
  console.log(' generate token');
  req.token = createToken(req.auth);
  next();
};

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  console.log('req.auth => ', req.auth);
  res.status(200).send(req.auth);
};


app.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  console.log(' ==========================  ', req.user);
  // prepare token for API
  req.auth = {
    id: req.user.id
  };

  next();
}, generateToken, sendToken);

//token handling middleware
var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function (req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
