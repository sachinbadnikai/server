const Joi=require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const productSchema = new Schema({
  image:String,  
  title: String, 
  description:String,
  price:String, 
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


// const product=mongoose.model('Product',new mongoose.Schema(
//     {        
//       image:String,  
//       title: String, 
//       description:String,
//       price:String, 
//       userId:{type:Schema.Types.ObjectId,
//         ref:'User'}

//    }));


   function validateFood(product){
    const schema={
         image:Joi.string(),
         title:Joi.string(),
         description:Joi.string(),
         price:Joi.number(),
         userId:Joi.string()
       };
       return Joi.validate(product,schema);
   }

   const product=mongoose.model('Product',productSchema);

   //module.exports = mongoose.model('Product', product);
   module.exports.product=product;
  
  // module.exports.product=product;
   module.exports.validate=validateFood;