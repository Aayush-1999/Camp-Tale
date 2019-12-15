const passport= require("passport");

module.exports=router=>{
//FACEBOOK LOGIN ROUTE
    router.get('/auth/facebook', passport.authenticate('facebook',{scope:['email']}));

    router.get('/auth/facebook/callback',passport.authenticate('facebook', 
        { 
            successRedirect: '/campground',
            failureRedirect: '/login' 
        })
      );
}
