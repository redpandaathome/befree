var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // '/index. js' is not required

//Comments New
router.get("/new", middleware.isLoggedIn,function(req, res){
    //find campgorund by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up campgrounds using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            //console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add add username and id to comment
                    //console.log("new comment's username will be: " ,req.user);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    //save comment
                    comment.save();

                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    //redirect campground show page
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/'+ campground._id);
                }
            })
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    //res.send("YOU HIT THE UPDATE ROUTE FOR COMMENT!");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    //findByIdAndRemove
    //res.send("THIS IS THE DESTROY COMMENT ROUTE!");
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            //back to the show page
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//middleware


module.exports = router;