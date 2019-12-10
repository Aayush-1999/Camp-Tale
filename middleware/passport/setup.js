//PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "Jon knows nothing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done)=> {
    done(null, user._id);
  });
 passport.deserializeUser((id, done)=> {
    User.findById(id, function(err, user){
       done(err, user);   
    });
  });