const mongoose = require("mongoose");
const { schema } = require("./review");
const { ref, required } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const ListingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
    },

    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    propertyType:{
        type: String,
        required:true,
        enum : ["Trending","Rooms","Amazing pools","Farms","Amazing View","Treehouses","Camping","Cabins","Arctic"],
    }
});

ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing.reviews}});
    }
});

const Listing = new mongoose.model("Listing",ListingSchema);

module.exports=Listing;