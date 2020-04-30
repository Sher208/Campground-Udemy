const express = require('express');
const app = express();
const reload = require('reload');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const mongoose = require('mongoose');
const User = require('./models/users');
const Comment = require('./models/comments');
const Campground = require('./models/campgrounds');
const seedDB = require("./seeds");
const methodOverride = require("method-override");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"))
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Thilak is good guy",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
app.use(methodOverride("_method"));

app.get('/', (req, res)=>{
    res.render('landing.ejs');
});

app.get('/campgrounds', (req, res)=>{
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log('Invalid');
        }else{
            console.log('Successful');
            res.render('campground/campgrounds.ejs', {campgrounds:campgrounds});
        }
    })
});

app.post('/campgrounds', isLoggedIn ,(req, res)=>{
    var name = req.body.campName;
    var image = req.body.campImage;
    var des = req.body.campDescription;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var camp = {name:name, image:image, description: des, author: author};
    Campground.create(camp, function(err, campground){
        if(!err){
            console.log(campground);
        }
    })
    // campgrounds.push(camp);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new',isLoggedIn,(req, res)=>{
    res.render('campground/new.ejs');
});

app.get('/campgrounds/:id', (req, res)=>{
    var campId = req.params.id;
    Campground.findById(campId).populate("comments").exec(function(err, foundCamp){
        if(!err){
            res.render('campground/show.ejs', {campground: foundCamp});
        }else{
            console.log(err);
        }
    })
});

app.get('/campgrounds/:id/edit',checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        res.render("campground/edit.ejs",{campgrounds:foundCamp});
    });     
});

app.put('/campgrounds/:id',checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp){
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

app.delete('/campgrounds/:id',checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect('/campgrounds');
    });
});

//=========
// Comments
//=========

app.get('/campgrounds/:id/comments/new',isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new.ejs", {campground : campgrounds})
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+ campground._id);
                }
            });
        }
    });
});

app.get('/campgrounds/:id/comments/:comment_id/edit', checkCommentOwnership, function(req, res){
    var commentID = req.params.comment_id;
    var campgroundID = req.params.id;
    Comment.findById(commentID, function(err, comment){
        res.render('comment/edit.ejs', {comment: comment, camp: campgroundID});
    });
});

app.put('/campgrounds/:id/comments/:comment_id',checkCommentOwnership, function(req, res){
    var commentID = req.params.comment_id;
    var campgroundID = req.params.id;
    Comment.findByIdAndUpdate(commentID, req.body.comment , function(err, comment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect('/campgrounds/'+campgroundID)
        }
    });
});

app.delete('/campgrounds/:id/comments/:comment_id',checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//==========
//AUTH ROUTE
//==========

//show register form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    })
});

//show login form
app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){});

//set up logout 
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err){
                res.redirect("back");
            }else{
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    console.log("Sorry you are not the valid user");
                    res.redirect("back");
                }
            }
        });
    }else{
        console.log("You need to be looged in");
        res.redirect("/login");
    }
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    console.log("Sorry you are not the valid user");
                    res.redirect("back");
                }
            }
        });
    }else{
        console.log("You need to be looged in");
        res.redirect("/login");
    }
}


app.listen(3000, ()=>{
    console.log("Server Up");
});

reload(app);