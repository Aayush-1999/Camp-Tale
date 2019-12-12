const passport              = require("passport"),
      google                = require("./googleStrategy"),
      facebook              = require("./facebookStrategy"),
      User                  = require("../../models/user"),
      expressSession        = require("express-session"),
      LocalStrategy         = require("passport-local");

module.exports = app =>{
  app.use(expressSession({
      secret: "I_am_inevitable",
      resave: false,
      saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));

  google(passport);

  facebook(passport);

  passport.serializeUser((user, done)=> {
      done(null, user._id);
    });
  passport.deserializeUser((id, done)=> {
      User.findById(id, function(err, user){
        done(err, user);   
      });
    });
}