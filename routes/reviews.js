const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedin,isReviewOwner} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");


//post route
router.post("/",isLoggedin,validateReview,wrapAsync(ReviewController.createReview));

//review delete 
router.delete("/:reviewID",isLoggedin,isReviewOwner,wrapAsync(ReviewController.deleteReview));

module.exports = router;