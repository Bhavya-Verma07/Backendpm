// Create a Pokemon model schema
const mongoose = require("mongoose");

const Pokemon = mongoose.model('Pokemon', {
    breed: String,
    age: Number,
    healthStatus: Number,
    adoptedBy: String
  });

  module.exports = Pokemon;