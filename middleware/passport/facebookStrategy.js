const FacebookStrategy = require("passport-facebook"),
      User             = require("../../models/user");

//PASSPORT-FACEBOOK CONFIGURATION
module.exports=passport=>{
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
}