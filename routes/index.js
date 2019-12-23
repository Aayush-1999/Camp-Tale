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
 
// follow user
// router.get('/follow/:id', middleware.isLoggedIn, async function(req, res) {
//   try {
//     let user = await User.findById(req.params.id);
//     user.followers.push(req.user._id);
//     user.save();
//     req.flash('success', 'Successfully followed ' + user.username + '!');
//     res.redirect('/user/' + req.params.id);
//   } catch(err) {
//     req.flash('error', err.message);
//     res.redirect('back');
//   }
// });

//SHOW REGISTER FORM
router.get("/register",(req,res)=>{
    res.render("register");
});

//REGISTER LOGIC ROUTE
router.post("/register",(req,res)=>{
    let newUser=new User({
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        email:req.body.email,
        image:"https://res.cloudinary.com/image-storage/image/upload/v1572009434/blank-avatar_opbhgx.png"
    });
    if(newUser.email==="aayushaggarwal2007@gmail.com")
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