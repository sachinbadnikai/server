const auth=require('../middelware/auth');
const admin=require('../middelware/admin');
const {foo,validate}=require('../models/m-food');
const express=require('express');
 const router=express.Router();


 var multer  = require('multer');
 
 var storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, 'uploads/food/')
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




router.get('/',async(req,res)=>{
    
    const food=await foo.find().sort('name');
    res.send(food);
});//second parameter is call back function for  when we get request from http to the end point '/' and also call route handler.

router.post('/',upload.single('image'),async(req,res)=>{
    const image=req.file;
    const {error}=validate(req.body);//object destructuring
    //if invalid 404-bad equest
    if(error) return res.status(400).send(error.details[0].message);
  if(!image) return res.status(422).send('only jpg,jpeg,png files are accepted'); 

        //400 bad request
        let food=new foo({
                    //personalmdetails
                      image:image.path,
                     name:req.body.name
        });
       
        food =await food.save();
        res.send(food);
});

router.put('/:id',upload.single('image'),async(req,res)=>{
    const image=req.file;
    const {error}=validate(req.body);//object destructuring
    //400 bad request
    if(!image) return res.status(422).send('only jpg,jpeg,png files are accepted');
                

    if(error) return res.status(400).send(error.details[0].message);
            //look up the food
            const food=await foo.findByIdAndUpdate(req.params.id,{
               //personal details
             image:image.path, 
             name:req.body.name
               
            },
                {
                new:true
            });
            res.send(food);//return updated food 
         });

   router.delete('/:id',[auth,admin],async(req,res)=>{
    const {error}=validate(req.body);//object destructuring
        //400 bad request
    if(error)  return res.status(400).send(error.details[0].message);
        //look up the food
        const foods=await foo.findByIdAndRemove(req.params.id);
        res.send(foods);//return delete food
   });

   router.get('/:id',async(req,res)=>{
         ////look up the food
        const food=await foo.findById(req.params.id);
        res.send(food);
});

router.get('/',async(req,res)=>{
    const name=req.query.name;
    const query=name?{name}:{};

    foo.find(query)
    .select(['name'])
    .exec(function(error,findname){
        if(error) return res.status(400).send(error.details[0].message);
    
        if(name && findname.length ===0) return res.send('given name is not found');
        return res.json({findname})
    });
});


  
   module.exports=router;
