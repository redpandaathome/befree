var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

//console.log(process.env.DATABASEURL);

mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://leeyumi415:forky@cluster0.tteh7.mongodb.net/Cluster0?retryWrites=true&w=majority",{
//     useNewUrlparser: true,
//     useCreateIndex: true
// }).then(()=> {
//     console.log("Connected to Atlas DB!");
// }).catch(err=> {
//     console.log("ERROR: ", err.message);
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
console.log(__dirname);
//seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
}); //currentUser: req.user

/////DB CONNECTION TEST
// const PostSchema = new mongoose.Schema({
//     title: String,
//     description: String
// });
// const Post = mongoose.model("Post", PostSchema);
// app.get('/test', async (req,res) => {
//     let post = await Post.create({title:'Test', description: 'This is a db test'});
//     res.send(post);
// });
/////
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started..!");
});
