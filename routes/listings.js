const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing");
const {isLoggedin, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );
//new route
router.get("/new",isLoggedin,listingController.renderNewForm);

//search route
router.get("/search",wrapAsync(listingController.searchListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedin,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedin,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );

//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing));



module.exports = router;