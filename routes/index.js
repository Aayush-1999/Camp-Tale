const express      = require("express"),
      router       = express.Router(),
      passport     = require("passport"),
      User         = require("../models/user"),
      googleAuth   = require("./auth/google"),
      facebookAuth = require("./auth/facebook"),
      middleware=require("../middleware");

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
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        username:req.body.username,
        avatar:req.body.avatar
    });
    if(req.body.adminCode==="We have hulk")
    {
        newUser.isAdmin=true;   
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
         req.flash("error",err.message);
         return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
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