const express = require("express");
const axios = require("axios");
require("dotenv").config();
const auth = require("../middlewares/auth");

// https://api.themoviedb.org/3/search/movie?api_key=932e1cb6e6022c6a3eb28f0228902f71&language=en-US&query=marvel&page=1&include_adult=false

const router = express.Router();

router.get("/:name", auth, async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query: req.params.name,
          api_key: process.env.MOVIEDB_API_KEY,
          language: "en-US",
          include_adult: false,
          page: 1,
        },
      }
    );

    const movies = data.results.filter(movie => movie.poster_path !== null);

    res.status(200).json(movies);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
