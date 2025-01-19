const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/Listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/exploreNest";

main().then(()=>{console.log("connection to the db successful")})
    .catch(err=>{console.log(err)});

async function main(){
    await mongoose.connect(MONGO_URL);
};


const init_db = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
        ...obj,
        owner:"676d17ba81d6af3dfc01a6e0",
    }));
    initdata.data = initdata.data.map((obj)=>({
        ...obj,
        propertyType:"Trending",
    }));
    await Listing.insertMany(initdata.data);
    console.log("database initialized successfully");
}

init_db();