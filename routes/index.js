const express=require("express");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport");
const middleware=require("../middleware");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//ROOT ROUTE
router.get("/",(req,res)=>{
    res.render("landing"); 
});
 
// follow user
router.get('/follow/:id', middleware.isLoggedIn, async function(req, res) {
  try {
    let user = await User.findById(req.params.id);
    user.followers.push(req.user._id);
    user.save();
    req.flash('success', 'Successfully followed ' + user.username + '!');
    res.redirect('/user/' + req.params.id);
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

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

//FACEBOOK LOGIN ROUTE
router.get('/auth/facebook', passport.authenticate('facebook',{scope:['email']}));

router.get('/auth/facebook/callback',passport.authenticate('facebook', 
      { 
        successRedirect: '/campground',
        failureRedirect: '/login' 
      })
  );

//GOOGLE LOGIN ROUTE
router.get('/auth/google', passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res)=> {
    // Successful authentication, redirect home.
    res.redirect('/campground');
});

//FORGOT PASSWORD
router.get('/forgot',(req, res)=> {
    res.render("forgot");
  });

//RESET PASSWORD
router.post('/forgot',(req, res, next)=> {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20,(err, buf)=> {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email },(err, user)=> {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          } 
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.GMAILID,
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAILID,
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token',(req, res)=> {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },(err, user)=> {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token',(req, res)=> {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },(err, user)=> {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.GMAILID,
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'aayush.agarwal.poorna@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("confirmation mail sent");
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/campground');
    });
  });
  

module.exports=router;