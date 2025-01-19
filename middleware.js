const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/Listing");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema,ReviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listing =await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = ReviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.isReviewOwner = wrapAsync(async(req,res,next)=>{
    let {id,reviewID} = req.params;
    const review =await Review.findById(reviewID);
    if(res.locals.currUser && !review.createdBy._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
});