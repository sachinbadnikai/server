const config=require('../config/dev');
const passport=require('passport');
//google authentication
exports.google= passport.authenticate('googleToken');
exports.facebook= passport.authenticate('facebookToken');