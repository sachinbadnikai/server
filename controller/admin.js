
const {product,validate}=require('../models/product');
const User=require('../models/users');
const mongoose=require('mongoose');

//Admin single  products with id
  exports.getSingleProducts=async(req,res)=>{
    const products=await product.findById(req.params.id);
    //res.send(food);
   // const products=await product.find();
    res.send(products);
}


//Admin get all products
exports.getAllProducts=async(req,res)=>{

    const products=await product.find();
    res.send(products);
}


//Add products
exports.postAddProducts=async(req,res,next)=>{

    const image=req.file;
     const {error}=validate(req.body);//object destructuring
     //if invalid 404-bad equest
     if(error) return res.status(400).send(error.details[0].message);
   if(!image) return res.status(422).send('only jpg,jpeg,png files are accepted'); 
   
 
         //400 bad request
         let Products=new product({
                     //personalmdetails
                      //  _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
                       image:image.path,
                      title:req.body.title,
                      price:req.body.price,
                      description:req.body.description,
                      userId:req.user,
         });
         console.log(req.user);
        
         Products =await Products.save();
         res.send(Products);
 }


//get all products
exports.updateProducts=async(req,res)=>{
    const image=req.file;
    const {error}=validate(req.body);//object destructuring
    //400 bad request
    if(!image) return res.status(422).send('only jpg,jpeg,png files are accepted');
                

    if(error) return res.status(400).send(error.details[0].message);
            //look up the food
            const prod=await product.findByIdAndUpdate(req.params.id,{
               //personal details
             image:image.path, 
             title:req.body.title,
             price:req.body.price,
             description:req.body.description,
               
            },
                {
                new:true
            });
         res.send(prod);//return updated product
         }


   
     