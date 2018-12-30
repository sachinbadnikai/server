const {product}=require('../models/product');
const {User,userSchema}=require('../models/users')
const {Order}=require('../models/order');


exports.postCart = async(req, res, next) => {
    const prodId = req.body.productId;
    product.findById(prodId)
      .then(product => {
       User.findOne().then(user=>{
         if(!user){
          user=new User({
            productId:req.body.productId,  
    });
         }   return user.addToCart(product);
       });
        
      })
      .then(result => {
        //console.log(result);
        //res.redirect('/cart');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  

  exports.getCart = (req, res, next) => {
    User.findOne().populate('cart.items.productId')
     .select('-name -active -isAdmin -lastName -email -password -phoneno -memberSince -secretToken')
        .then(user=>{
           // users=User.cart;
            console.log(user);
            res.send(user);
        });
    // user
    //   .populate('cart.items.productId')
    //   .execPopulate()
    //   .then(user => {
    //     const products = user.cart.items;
    //     res.render('shop/cart', {
    //       path: '/cart',
    //       pageTitle: 'Your Cart',
    //       products: products
    //     });
    //   })
    //   .catch(err => {
    //     const error = new Error(err);
    //     error.httpStatusCode = 500;
    //     return next(error);
    //   });
  };



  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    User.findOne().then(user=>{
      if(!user){
       user=new User({
         productId:req.body.productId,  
        });
      }   
      user
      .removeFromCart(prodId)
      .then(result => {
        
        console.log('item is removed');
       // res.redirect('/cart');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    });
   
  };



  exports.postOrder = (req, res, next) => {
    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    //const token = req.body.stripeToken; // Using Express
    //let totalSum = 0;
    user=new User({ 
    });
    User.findOne({})
     .populate('cart.items.productId')
    //  .execPopulate()
    //.select('cart.items.productId')
      .then(user => {  
        // user.cart.items.forEach(p => {
        //   totalSum += p.quantity * p.productId.price;
        // });
        console.log(user);
      
        const products = user.cart.items.map(i => {
          return { quantity: i.quantity, product:i.productId  };
        });
      
        const order = new Order({
          
          user: {
            name:  user.name,
            userId: user
          },
          products: products
        });
      
        return order.save();
      
      })
      .then(result => {
        // const charge = stripe.charges.create({
        //   amount: totalSum * 100,
        //   currency: 'usd',
        //   description: 'Demo Order',
        //   source: token,
        //   metadata: { order_id: result._id.toString() }
        // });
      
       
      })
      .then(() => {
        User.findOne().then(user=>{
          if(!user){
           user=new User({
            
          });
          }    
          return user.clearCart();
        });
       
      //  return user.save();
      //  res.redirect('/orders');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  


  //get order

  exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId':req.user._id })
      .then(orders => {
        res.send(orders);
        // res.render('shop/orders', {
        //   path: '/orders',
        //   pageTitle: 'Your Orders',
        //   orders: orders
        // });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };