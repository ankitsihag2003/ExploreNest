const User = require("../models/user.js");

module.exports.signupForm  = (req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.registerUser = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email});
        let register_user = await User.register(newUser,password);
        req.login(register_user,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to ExploreNest!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs")
};
module.exports.loginUser = (req,res)=>{
    req.flash("success","Welcome to ExploreNest! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("error","You are logged out!");
            res.redirect("/listings");
        }
    });
};