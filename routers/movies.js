const router = require("express").Router();
const moviesController = require("../controllers/movies");

// ENDPOINT MOVIES
router.get("/movies", moviesController._getAllMovies);

router.get("/movies/:id", moviesController._selectedMovies);

router.post(
  "/movies",
  moviesController._validationAddMovie,
  moviesController._addMovie
);

router.put("/movies/:id", moviesController._editMovie);

router.delete("/movies/:id", moviesController._deleteMovie);

module.exports = router;
