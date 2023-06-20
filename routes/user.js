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


const express = require("express");
const router = express.Router();
const UserSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");
const passport = require("passport");
const {
  signJWT,
  setCookie,
  clearCookie,
} = require("../authorization/token");

router.post("/user", async (req, res) => {
  try {
    const { firstName, lastName, email, contactNo, password } = req.body;
    if (!firstName || !lastName || !email || !contactNo || !password) {
      return res.status(422).json({ error: "please fill all the fields" });
    }
   

    const result = await UserSchema.findOne({ email: email });
    if (result) {
      res.status(422).json({ error: "User already exist" });
      throw new Error("User already exists!"); 
    }
    const encryptedpass = await bcrypt.hash(password, 12); 
    const newUser = new UserSchema({
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
    const userLogin = await UserSchema.findOne({ email: email }); // in case email does not matched then null will be return by findOne
 
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
//About us page
router.get(
  "/current",
  passport.authenticate("user", { session: false }),
  async (req, res) => {
    const user = await UserSchema.findById(req.user.id);
    res.json({ success: true, data: user });
  }
);

//logout api
router.get("/logout", function (req, res) {
  try {
    clearCookie(res);
    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    return sendErrorResponse(res, err);
  }
});

module.exports = router;