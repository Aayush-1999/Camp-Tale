const passport=require("passport");

//GOOGLE LOGIN ROUTE
module.exports=router=>{
    router.get('/auth/google', passport.authenticate('google', { scope: ['email','profile'] }));

    router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res)=> {
        // Successful authentication, redirect home.
        res.redirect('/campground');
    });
}
