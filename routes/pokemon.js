// // API endpoint to fetch all available Pokemon for adoption:

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const POKEMONSCHEMA = require("./models/pokemonModel");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Get all available Pokemon for adoption
app.get("/pokemon", async (req, res) => {
  try {
    const availablePokemon = await POKEMONSCHEMA.find({ adoptedBy: null });
    res.json(availablePokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available Pokemon" });
  }
});

// Adopt a Pokemon
app.post("/pokemon/:id/adopt", async (req, res) => {
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
app.post("/pokemon/:id/feed", async (req, res) => {
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
