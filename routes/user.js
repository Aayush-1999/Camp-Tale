const express     = require("express"),
      router      = express.Router(),
      User        = require("../models/user"),
      Campground  = require("../models/campground");

// user profile
router.get('/:id', async function(req, res) {
    try {
      let user = await User.findById(req.params.id).exec();
      let campgrounds= await Campground.find().where("author.id").equals(user._id).exec();
      res.render('user/show', { user,campgrounds });
    } 
    catch(err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
  });

module.exports=router;