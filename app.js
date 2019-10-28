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

//PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "Jon knows nothing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//PASSPORT-FACEBOOK CONFIGURATION
passport.use(new FacebookStrategy({
   clientID: process.env.FACEBOOK_APP_ID ,
   clientSecret: process.env.FACEBOOK_APP_SECRET,
   callbackURL: "http://localhost:3000/auth/facebook/callback",
   profileFields: ['id', 'displayName', 'photos', 'email','name']
  },
   (accessToken, refreshToken, profile, done)=> {
      process.nextTick(function(){
         User.findOne({ 'id':profile.id },(err, user)=> {
            if(err) {
               return done(err);
            }
            if(user){
               return done(null, user);
            } 
            else{
               var newUser = new User({
                  id:profile.id,
                  token:accessToken,
                  firstname:profile.name.givenName,
                  lastname:profile.name.familyName,
                  email:profile.emails[0].value,
                  username:profile.emails[0].value,
                  avatar:profile.photos[0].value
               });
               newUser.save(function(err) {
                  if(err) {
                     return done(err);
                  } 
                  else {
                     done(null, newUser);
                  }
               });
            }
         });
      });
   }
));

//PASSPORT GOOGLE CONFIGURATION
passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: "http://localhost:3000/auth/google/callback",
   profileFields: ['id', 'displayName', 'photos', 'email','name']
 },
 (accessToken, refreshToken, profile, done)=> {
   process.nextTick(function(){
         User.findOne({ 'id':profile.id },(err, user)=> {
            if(err) {
               return done(err);
            }
            if(user){
               return done(null, user);
            } 
            else{
               var newUser = new User({
                  id:profile.id,
                  token:accessToken,
                  firstname:profile.displayName,
                  email:profile.emails[0].value,
                  username:profile.emails[0].value,
                  avatar:profile.photos[0].value
               });
               newUser.save(function(err) {
                  if(err) {
                     return done(err);
                  } 
                  else {
                     done(null, newUser);
                  }
               });
            }
         });
      });
 }
));

passport.serializeUser((user, done)=> {
   done(null, user._id);
 });
passport.deserializeUser((id, done)=> {
   User.findById(id, function(err, user){
      done(err, user);   
   });
 });

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