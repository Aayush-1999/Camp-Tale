const express      = require("express"),
      router       = express.Router(),
      passport     = require("passport"),
      User         = require("../models/user"),
      googleAuth   = require("./auth/google"),
      facebookAuth = require("./auth/facebook");

//ROOT ROUTE
router.get("/",(req,res)=>{
    res.render("landing"); 
});

//SHOW REGISTER FORM
router.get("/register",(req,res)=>{
    res.render("register");
});

//REGISTER LOGIC ROUTE
router.post("/register",(req,res)=>{
    let newUser=new User({
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        displayName:req.body.firstname+" "+req.body.lastname,
        email:req.body.email,
        image:"https://res.cloudinary.com/image-storage/image/upload/v1572009434/blank-avatar_opbhgx.png"
    });
    if(req.body.adminCode===process.env.ADMIN_CODE)
    {
        newUser.isAdmin=true;   
    }
    console.log(newUser);
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
         req.flash("error",err.message);
         return res.render("register");
        }
        req.logIn(user,function(err){  
            res.redirect("/campground");
        });
    });
});
 
//SHOW LOGIN FORM
router.get("/login",(req,res)=>{
    res.render("login");
});
 
//LOGIN LOGIC ROUTE
router.post("/login",passport.authenticate("local",
    {
       successRedirect:"/campground",
       failureRedirect:"/login"
    }),(req,res)=>{
});
 
//LOGOUT ROUTE
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success","Successfully Logout");
    res.redirect("/login");
})

googleAuth(router);
facebookAuth(router);

module.exports=router;