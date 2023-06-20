// Connection to MongoDB database
const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose
    .connect("mongodb://localhost/pokemonAdoption", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Failed to connect to MongoDB:", error);
    });
};
module.exports = connectDB;
