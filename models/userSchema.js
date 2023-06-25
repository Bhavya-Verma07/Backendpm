// // schema for creating users: users.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   adoptedPokemons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Pokemon',
//   }],
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;


// creating user schema using models to save data in database in a document inside a particular collection
//the collection name in database is users


const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: Number,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },
    // cpassword: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timeStamps: true }
);
userSchema.methods.generateAuthToken = async function () {
 console.log(error);
  // }
  try {
   
    let newtoken = jwt.sign({ _id: this._id }, `${process.env.SECRET_KEY}`);

    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();
    return newtoken;
  } catch (error) {
    console.log(error);
  }
};


const UserSCHEMA = mongoose.model("USER", userSchema);
module.exports = UserSCHEMA;
