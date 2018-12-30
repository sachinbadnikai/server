const jwt=require('jsonwebtoken');
const Joi=require('joi');
// const config=require('config');
const mongoose=require('mongoose');
const config=require('../config/dev');

const Schema=mongoose.Schema;

const userSchema=new mongoose.Schema(
    {        
         name: {type: String},
         lastName:{type:String},
         phoneno:{type: String},
         password: String,
        // confirm:String,
         email: {type: String, unique: true},
         term:{type:String},
         secretToken:String,
         active:{type: Boolean, default: false},
         resetToken: String,
         resetTokenExpiration: Date,
         isAdmin: {type: Boolean, default: false},
         memberSince : {type : Date, default : Date.now},
         googleid:String,
         facebookid:String,
        
         cart: {
          items: [
            {
              productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
              },
              quantity: { type: Number, required: true }
            }
          ]
        }

     });

     userSchema.methods.addToCart =  function(product) {
       console.log(product);
      const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
      });
      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];
    
      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: product._id,
          quantity: newQuantity
        });
      }
      const updatedCart = {
        items: updatedCartItems
      };
      this.cart = updatedCart;
      return this.save();
    };


    userSchema.methods.removeFromCart = function(productId) {
      const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
      });
      this.cart.items = updatedCartItems;
      return this.save();
    };

    userSchema.methods.clearCart = function() {
      this.cart = { items: [] };
      return this.save();
    };

           userSchema.methods.generateAuthToken=function(){
           const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.SECRET, {
                          expiresIn: 60 * 120
                 });
           return token;
}

   
const User=mongoose.model('User',userSchema);

   function validateUser(User){
    const schema={
            name:Joi.string().required().min(3).max(50),
           lastName:Joi.string(),
           email:Joi.string().email().required(),
           password:Joi.string().min(5).max(255),
           confirm:Joi.string().min(5).max(255),
           phoneno:Joi.string().required().min(10),
           isAdmin:Joi.boolean(),
           memberSince:Joi.date(),
       };
       return Joi.validate(User,schema);
   }

   module.exports.User=User;
   module.exports.validate=validateUser;
   module.exports.userSchema=userSchema;
  