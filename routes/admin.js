const auth=require('../middelware/auth');
const express=require('express');
const router=express.Router();

const adminController=require('../controller/admin');

const user=require('../models/users');
var multer  = require('multer');
 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/add-products/')
    },
    filename: function (req, file, cb) {
        const ext=file.mimetype.split('/')[1];
      cb(null, file.originalname + '-' + Date.now()+'.'+ext);
    }
  });
  
   const fileFilter=(req,file,cb)=>{
       if(
           file.mimetype==='image/png' ||
           file.mimetype==='image/jpg' ||
           file.mimetype==='image/jpeg' 
         ){
           cb(null,true);
         }
     else{
       cb(null,false);
     }
   
   
   }
// app.use(multer({Storage:fileStorage,fileFilter:fileFilter}).single('image'));
  var upload = multer({ storage: storage,
      fileFilter:fileFilter
});


//admin add product to post the products
router.post('/add-products',auth,upload.single('image'),adminController.postAddProducts);
//admin update products
router.put('/update-products/:id',upload.single('image'),adminController.updateProducts);
//admin get product by id
router.get('/products/:id',adminController.getSingleProducts);
//admin get all products
router.get('/allproducts',adminController.getAllProducts);

//Add to cart
//router.post('/add-to-cart',adminController.addToCart);
module.exports=router;