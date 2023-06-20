const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

const User = require("../models/userSchema");

const Authenticate = async (req, res, next) => {
    try { 
        console.log(req.cookies);
    const token = req.cookies.jwtoken;
      console.log(token);
    const verifyToken = jwt.verify(token, `${process.env.SECRET_KEY}`);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("User not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    res.status(401).json("Unauthorized: No token provided");
    console.log(error);
  }
};
module.exports = Authenticate;