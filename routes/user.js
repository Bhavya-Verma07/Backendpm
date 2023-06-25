const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");

const UserSCHEMA = require("../models/userSchema");
const POKEMONSCHEMA = require("../models/pokemonModel");

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
  try{
    res.clearCookie("jwtoken");
    res.status(200).json({ message: "User logged out" });

  }catch(err){
    return sendErrorResponse(res, err);
  }
  // we are clearing the cookie once cookie clear then user will log out
 
});
module.exports = router;

//for Pokemon**************************************************************************

// Get all available Pokemon for adoption
router.get("/pokemon", async (req, res) => {
  try {
    const availablePokemon = await POKEMONSCHEMA.find({ adoptedBy: null });
    res.json(availablePokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available Pokemon" });
  }
});

// Adopt a Pokemon
router.post("/pokemon/:id/adopt", async (req, res) => {
  const pokemonId = req.params.id;
  const { user } = req.body;

  try {
    const pokemon = await POKEMONSCHEMA.findById(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    if (pokemon.adoptedBy) {
      return res.status(400).json({ error: "Pokemon already adopted" });
    }

    pokemon.adoptedBy = user;
    await pokemon.save();

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to adopt the Pokemon" });
  }
});

// Feed a Pokemon
router.post("/pokemon/:id/feed", async (req, res) => {
  const pokemonId = req.params.id;

  try {
    const pokemon = await POKEMONSCHEMA.findById(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    if (!pokemon.adoptedBy) {
      return res.status(400).json({ error: "Pokemon has not been adopted" });
    }

    // Increase health status
    pokemon.healthStatus++;
    await pokemon.save();

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to feed the Pokemon" });
  }
});




