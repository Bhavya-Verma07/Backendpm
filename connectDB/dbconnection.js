// Connection to MongoDB database

const mongoose = require("mongoose");

const connectDB =async()=>{
    try {
       await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongodb is connected");
    } catch (error) {
       console.log(error); 
       console.log("Database is not connected");
    }
};

module.exports = connectDB;
