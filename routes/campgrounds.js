const express=require("express");
const router=express.Router();
const Campground=require("../models/campground");
const Notification=require("../models/notification");
const User=require("../models/user");
const methodOverride=require("method-override");
const middleware=require("../middleware");
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);
const multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'image-storage', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//SHOW CAMPGROUND
router.get("/",(req,res)=>{
   let noMatch=null;
   if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      Campground.find({name:regex},function(err,matchedCampground)
      {
         if(err){
            console.log(err);
            res.redirect("back");
         }
         else{
            if(matchedCampground.length<1){
               noMatch="No Campgrounds found. Please try again.";
            }
            res.render("index",{campground:matchedCampground,noMatch:noMatch});
         }
      });
      }
   else{
    Campground.find({},(err,allCampgrounds)=>{
       if(err){
          console.log(err);
          res.redirect("back");
       }
       else
          res.render("index",{campground:allCampgrounds,noMatch:noMatch});
    });
   }
});
 
//ADD CAMPGROUND
router.post("/",middleware.isLoggedIn,upload.single('image'),async function(req,res){
   try{
      let result= await cloudinary.v2.uploader.upload(req.file.path)// can also add webpurifier to purify images uploaded on server (for more details see cloudinary addons)
       // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
       // add image's public url to the campground object for identifying and deleting image on the cloudinary
      req.body.campground.imageId = result.public_id;
       // add author to campground
      req.body.campground.author = {
         id: req.user._id,
         username: req.user.username
      }
      let data= await geocoder.geocode(req.body.location);
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
     
      let campground=await Campground.create(req.body.campground);
      let user = await User.findById(req.user._id).populate('followers').exec();
      let newNotification = {
        username: req.user.username,
        campgroundId: campground.id
      }
      for(const follower of user.followers) {
        let notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save();
      }
      //redirect back to campgrounds page
      res.redirect("/campground/${campground.id}");
   } catch(err) {
     req.flash('error', err.message);
     res.redirect('back');
   }
});

//SHOW FORM FOR ADDING NEW CAMPGROUND
router.get("/new",middleware.isLoggedIn,(req, res)=> {
    res.render("campground/newcampground") ;
});

//SHOW INFO ABOUT A CAMPGROUND
router.get("/:id",(req, res)=> {
     Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
        if(err || !foundCampground)
        {
           req.flash("error","Campground not found");
           res.redirect("back");
        }
        else{
        res.render("campground/show",{campground:foundCampground});   
        }
     });
});

//EDIT CAMPGROUND
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
   Campground.findById(req.params.id,(err,foundCampground)=>{
      if(err){
         console.log(err);
         res.redirect("/campground");
      }
      else{
         res.render("campground/edit",{campground:foundCampground});
      }
   });
});

//UPDATE CAMPGROUND
router.put("/:id",middleware.checkCampgroundOwnership, upload.single('image'),(req,res)=>{
   geocoder.geocode(req.body.location, (err, data)=> {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.lat = data[0].latitude;
      req.body.lng = data[0].longitude;
      req.body.location = data[0].formattedAddress;
  
      Campground.findById(req.params.id,async function(err,campground){
         if(err){
            req.flash("error",err.message);
            res.redirect("/campground/"+ req.params.id + "/edit");
         }
         else{
            if(req.file){
               try{
                  await cloudinary.v2.uploader.destroy(campground.imageId);               
                  let result=await cloudinary.v2.uploader.upload(req.file.path);
                  campground.image=result.secure_url;
                  campground.imageId=result.public_id;
               }
               catch(err){
                  req.flash("error",err.message);
                  res.redirect("/campground/"+ req.params.id + "/edit");
               }
            }
            
            campground.name=req.body.name;
            campground.lat=req.body.lat;
            campground.lng=req.body.lng;
            campground.location=req.body.location;
            campground.description=req.body.description;
            campground.save();
            req.flash("success","Campground Updated successfully")
            res.redirect("/campground/" + req.params.id);
         }
      });
   });
});

//REMOVE CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
   Campground.findById(req.params.id,async function(err,campground){
      // if(err){
      //    req.flash("error",err.message);
      //    return res.redirect("back");
      // }
      try{
         await cloudinary.v2.uploader.destroy(campground.imageId); 
         campground.remove();
         req.flash("success","Campground deleted successfully");
         res.redirect("/campground");
      }
      catch(err){
         req.flash("error",err.message);
         return res.redirect("back");  
      }
   });
});

function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;
 