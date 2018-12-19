const config=require('../config/dev');
const jwt=require('jsonwebtoken');
function auth(req,res,next){
   const token= req.header('Authorization');
   console.log(token);
   if(!token) res.status(401).send('no token provide');

   try{
     const decode= jwt.verify(token,config.SECRET);
    //  console.log("token",token,"decode"+decode );

    req.user=decode;
     next();
   }
  catch(ex){
    res.status(401).send("invalid token");
  }
 
}
module.exports=auth;