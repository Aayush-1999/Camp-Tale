const Campground=require("../models/campground.js"),
      Comments=require("../models/comments.js");
let middlewareObj={};

middlewareObj.checkCampgroundOwnership=(req,res,next)=>{
    if(req.isAuthenticated()){
       Campground.findById(req.params.id,(err,foundCampground)=>{
          if(err || !foundCampground){
             req.flash("error","Campground not found");
             res.redirect("back");
          }
          else{
             if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
             }
             else
             {
               req.flash("You don't have permission to do that");
               res.redirect("back");
             }
          }
       });
    }
    else
    {
      req.flash("error","You don't have permission to do that");
      res.redirect("/campground");
    }
}

middlewareObj.checkCommentOwnership=(req,res,next)=>{
   if(req.isAuthenticated()){
       Comments.findById(req.params.comment_id,(err,foundComment)=>{
          if(err || !foundComment){
             req.flash("error","Comment not found");
             res.redirect("back");
          }
          else{
             if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
             }
             else
             {
               req.flash("error","You don't have permission to do that");
               res.redirect("back");
             }
          }
       });
   }
   else
       res.redirect("back");
 }

 middlewareObj.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated())
    {
       return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
 }

 module.exports=middlewareObj;