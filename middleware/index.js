const express       = require("express"),
      path          = require("path"),
      flash         = require("connect-flash"),
      compression   = require("compression"),  
      passportSetup = require("./passport/setup"),
      security      = require("./security");
      User          = require("../models/user");

module.exports = app => {

    app.use(compression({ filter: shouldCompress }));
    
    function shouldCompress (req, res) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false
        }   
        // fallback to standard filter function
        return compression.filter(req, res);
    }

    passportSetup(app);
    security(app);
    app.use(flash());

    app.use(async function(req,res,next){
        res.locals.currentUser = req.user;
        res.locals.error  =  req.flash("error");
        res.locals.success  =  req.flash("success");
        res.locals.csrfToken = req.csrfToken();
        next();
     });

    app.use(express.static(path.join(__dirname,"../node_modules/bootstrap/dist")));
    app.use(express.static(path.join(__dirname,"../public")));
};