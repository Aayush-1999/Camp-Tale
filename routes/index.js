const express      = require("express"),
      router       = express.Router(),
      passport     = require("passport"),
      bcrypt       = require("bcryptjs"),
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
router.post("/register",async (req,res)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashcode = bcrypt.hashSync(req.body.password, salt);    
        let user = await User.create({
            firstName:req.body.firstname,
            lastName:req.body.lastname,
            displayName:req.body.firstname + " " + req.body.lastname,
            email:req.body.email,
            password:hashcode,
            image:"https://res.cloudinary.com/image-storage/image/upload/v1572009434/blank-avatar_opbhgx.png"
        }); 
        if(req.body.adminCode===process.env.ADMIN_CODE)
            {
                newUser.isAdmin=true;   
            }
        req.logIn(user,function(err){  
            res.redirect("/campground");
        });                   
    }
    catch(err){
        console.log(err);
        req.flash("error","This Email is already registered");
        res.redirect("/register");
    }    
});
 
//SHOW LOGIN FORM
router.get("/login",(req,res)=>{
    res.render("login");
});
 
//LOGIN LOGIC ROUTE
router.post("/login", passport.authenticate("local",
    {
        failureFlash:true,
        failureRedirect:"/login"
    }),(req,res)=>{
        res.redirect("/campground")
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