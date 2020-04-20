const express               = require("express"),
      app                   = express(),
      bodyparser            = require("body-parser"),
      mongoose              = require("mongoose"),
      methodOverride        = require("method-override"),
      middleware            = require("./middleware/index");
      seed                  = require("./seed");

require("dotenv").config();

//ROUTES
const campgroundRoute = require("./routes/campgrounds"),
      commentRoute    = require("./routes/comments"),
      indexRoute      = require("./routes/index"),
      userRoute       = require("./routes/user"),
      resetPasswordRoute = require("./routes/resetpass");

mongoose.connect(process.env.DATABASEURL,{useUnifiedTopology: true, useNewUrlParser:true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
middleware(app);

app.use("/campground",campgroundRoute);
app.use("/campground/:id/comments",commentRoute);
app.use("/",indexRoute);
app.use("/",resetPasswordRoute);
app.use("/user",userRoute);

app.listen(process.env.PORT || 3000)
{
   console.log("Server has started"); 
};