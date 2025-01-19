const Mongoose = require("mongoose");
const User = require("./user");

const reviewModel = new Mongoose.Schema({
    comment : {
        type:String
    },
    rating : {
        type : Number,
        min:1,
        max:5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    createdBy : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
});

const Review = Mongoose.model("Review",reviewModel);

module.exports = Review;