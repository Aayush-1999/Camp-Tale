const express=require("express");
const router=express.Router({mergeParams:true});
const Campground=require("../models/campground");
const Comments=require("../models/comments");
const middleware=require("../middleware");

//SHOW FORM FOR ADDING NEW COMMENT
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
      if(err || !foundCampground)
         {
            req.flash("error","Campground not found");
            res.redirect("back");
         }
      else
          res.render("comment/newComment",{campground:foundCampground});
    });
 });

//ADDING NEW COMMENT
router.post("/",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
       if(err)
       {
          res.redirect("/campground");
       }
       else{
          Comments.create(req.body.comment,(err,comment)=>{
             if(err)
               console.log(err);
             else
               comment.author.id=req.user._id;
               comment.author.username=req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect("/campground/"+campground._id);
          });
       }
    });
 });

//EDIT COMMENT 
 router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
       if(err || !foundCampground)
       {
          req.flash("error","Campground not found");
          return res.redirect("back");
       }
       Comments.findById(req.params.comment_id,(err,foundComment)=>{
         if(err)
         {
            res.redirect("back");
         }
         else
         {
            res.render("comment/edit",{campground_id:req.params.id,comment:foundComment});
         }
      });
    });
 });

//UPDATE COMMENT
 router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,newComment)=>{
       if(err)
       {
          console.log(err);
          res.redirect("back");
       }
       else
       {
          res.redirect("/campground/"+req.params.id);
       }
    });
 });

 //DELETE COMMENT
 router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comments.findByIdAndRemove(req.params.comment_id,function(err){
       if(err)
         res.redirect("back");
       else
         res.redirect("/campground/"+req.params.id);
    });
 });

 module.exports=router;