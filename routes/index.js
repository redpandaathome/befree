var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

//show register form
router.get("/", function(req,res){
    //res.send("This will be the landing page soon!");
    res.render("landing");
});

// =======================
// AUTH ROUTES
// =======================

// show register form
router.get("/register", function(req,res){
    res.render("register", {page: 'register'});
});

router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});


//show login form
router.get("/login", function(req,res){
    res.render("login", {page: 'register'});
});

//handling login logic
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {successRedirect: "/campgrounds", 
    failureRedirect: "/login",
    failureFlash: true,
    //successFlash: "Welcome back " + req.user.username + "!"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;