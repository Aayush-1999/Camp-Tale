const express               = require("express"),
      app                   = express(),
      bodyparser            = require("body-parser"),
      mongoose              = require("mongoose"),
      flash                 = require("connect-flash");
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      FacebookStrategy      = require('passport-facebook').Strategy;
      GoogleStrategy        = require('passport-google-oauth20').Strategy;
      passportLocalMongoose = require("passport-local-mongoose"),
      expressSession        = require("express-session"),
      nodemailer            = require("nodemailer"),
      async                 = require("async"),
      methodOverride        = require("method-override"),
      Campground            = require("./models/campground"),
      Comments              = require("./models/comments"),
      User                  = require("./models/user"),
      seed                  = require("./seed");

    require("dotenv").config();

    //ROUTES
var campgroundRoute = require("./routes/campgrounds"),
    commentRoute    = require("./routes/comments"),
    indexRoute      = require("./routes/index"),
    userRoute       = require("./routes/user"),
    notificationRoute=require("./routes/notification");

mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seed();

app.use(async function(req, res, next){
   res.locals.currentUser = req.user;
   if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log(err.message);
    }
   }
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/campground",campgroundRoute);
app.use("/campground/:id/comments",commentRoute);
app.use("/",indexRoute);
app.use("/user",userRoute);
app.use("/notification",notificationRoute);

app.listen(process.env.PORT || 3000)
{
   console.log("Server has started"); 
};