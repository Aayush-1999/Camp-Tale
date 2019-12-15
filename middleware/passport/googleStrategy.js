const GoogleStrategy = require("passport-google-oauth20"),
      User           = require("../../models/user");


//PASSPORT GOOGLE CONFIGURATION
module.exports = passport => {
   passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/auth/google/callback`,
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
}