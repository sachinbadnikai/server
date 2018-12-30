const error=require('../middelware/error');
const express=require('express');
const food=require('../routes/r-food');
const user=require('../routes/users');
const auth=require('../routes/auth');
//customer forgot and reset password
const forgots=require('../routes/users');
const resets=require('../routes/users');
const verifyEmail=require('../routes/users');

 //passport google authentication
const googlePassport=require('../routes/passport-auth');
//passport facebook authentication
const facebookPassport=require('../routes/passport-auth');

//add,delete,update,get products
const addProducts=require('../routes/admin');
const updateProduct=require('../routes/admin');
const getSingleProducts=require('../routes/admin');
const getAllProducts=require('../routes/admin');

//ADD TO CART SECTTION
const addToCart=require('../routes/shop');




module.exports=function(app){
    //api reference to the routes
    app.use(express.json());//middle ware
    app.use('/api/food',food);
    app.use('/api',user);
    //customer authentication
    app.use('/api/auth',auth);
    //customer forgot and reset password
    app.use('/api',forgots);
    app.use('/api',resets);
    app.use('/api',verifyEmail);

    //passport google authentication
    app.use('/api',googlePassport);
     //passport facebook authentication
    app.use('/api',facebookPassport);


   
    //add-products
    app.use('/api',addProducts);
    //update-products
    app.use('/api',updateProduct);
    //get single products
    app.use('/api',getSingleProducts);
    //get all products
    app.use('/api',getAllProducts);

     //ADD TO CART SECTTION
     app.use('/api',addToCart)


    app.use(error);
 

}