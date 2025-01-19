const Listing = require("../models/Listing");
const ExpressError = require("../utils/ExpressError.js");
const { populate } = require("../models/user.js");

module.exports.index = async (req,res)=>{
    const propertyType = req.query.filter;
    const query={};
    if(propertyType){
        query.propertyType= propertyType;
    }
    const allListings = await Listing.find(query);
    res.render("listings/index",{allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showListings=async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"createdBy"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show",{listing});
};
module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    else{
        res.render("listings/edit.ejs",{listing});
    }
};
module.exports.updateListing = async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} =req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchListing = async(req,res)=>{
    try{
        const {searchListing} = req.query;
        if(!searchListing){
            return res.redirect("/listings");
        }
        const query = {
            $or : [
                {title : {$regex:searchListing , $options:"i"}},
                {location : {$regex:searchListing , $options:"i"}},
                {country : {$regex:searchListing , $options:"i"}}
            ]
        };
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs",{allListings});
    }catch(err){
        if(err){
            req.flash("error","Error in searching!");
            res.redirect("/listings");
        }
    }
};
