// // Create an API endpoint to adopt a Pokemon:

// // routes/users.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const Pokemon = require('../models/pokemon');

// // POST /users/:userId/adopt/:pokemonId
// // Adopt a Pokemon
// router.post('/:userId/adopt/:pokemonId', async (req, res) => {
//   try {
//     const { userId, pokemonId } = req.params;
//     const user = await User.findById(userId);
//     const pokemon = await Pokemon.findById(pokemonId);

//     if (!user || !pokemon) {
//       return res.status(404).json({ message: 'User or Pokemon not found' });
//     }

//     if (pokemon.adoptedBy) {
//       return res.status(400).json({ message: 'Pokemon already adopted' });
//     }

//     pokemon.adoptedBy = user._id;
//     user.adoptedPokemons.push(pokemon._id);

//     await pokemon.save();
//     await user.save();

//     res.json({ message: 'Pokemon adopted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;
// const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const UserSCHEMA = require("../models/userSchema");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");
const passport = require("passport");
// const { signJWT, setCookie, clearCookie } = require("../authorization/token");

router.post("/user", async (req, res) => {
  try {
    const { firstName, lastName, email, contactNo, password } = req.body;
    if (!firstName || !lastName || !email || !contactNo || !password) {
      return res.status(422).json({ error: "please fill all the fields" });
    }

    const result = await UserSCHEMA.findOne({ email: email });
    if (result) {
      res.status(422).json({ error: "User already exist" });
      throw new Error("User already exists!");
    }
    const encryptedpass = await bcrypt.hash(password, 12);
    const newUser = new UserSCHEMA({
      firstName,
      lastName,
      email,
      contactNo,
      password: encryptedpass,
    });
    await newUser.save();
    res.json({ success: true, message: "new user is logged in" });
  } catch (error) {
    console.log("Getting an error");
    console.log(error);
    res.status(404).json({ success: false, message: "user is not created" });
  }
});

// login route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the details" });
    }
    const userLogin = await UserSCHEMA.findOne({ email: email }); // in case email does not matched then null will be return by findOne

    // for checking password

    if (!userLogin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatched = await bcrypt.compare(password, userLogin.password);

    if (!isMatched) {
      return res.status(400).json({ error: "Invalid credientials" });
    } else {
      // getting token
      const payloaduser = {
        id: userLogin._id,
        name: userLogin.firstName + " " + userLogin.lastName,
      };
      const token = await signJWT(payloaduser);
      setCookie(res, token);

      res.json({ success: true, message: "Logged in Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});


//About us ka page
router.get("/about", authenticate, (req, res) => {
  console.log(`hello my About`);
  res.json({ success: true, data: req.rootUser });
});

// Log out ka page
router.get("/logout", (req, res) => {
  // we are clearing the cookie once cookie clear then user will log out
  res.clearCookie("jwtoken");
  res.status(200).json({ message: "User logged out" });
});
module.exports = router;

module.exports = router;
