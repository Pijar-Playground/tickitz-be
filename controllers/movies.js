const moviesModel = require("../models/movies");

const moviesController = {
  _getAllMovies: async (req, res) => {
    try {
      const request = await moviesModel.getAllMovies();

      res.json({
        status: true,
        message: "Get data success",
        data: request,
      });
    } catch (error) {
      res.status(502).json({
        status: false,
        message: "Something wrong in our server",
        data: [],
      });
    }
  },
  _selectedMovies: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await moviesModel.getSelectedMovie(id);

      res.json({
        status: true,
        message: "Get data success",
        data: request,
      });
    } catch (error) {
      res.status(502).json({
        status: false,
        message: "Something wrong in our server",
        data: [],
      });
    }
  },
  _validationAddMovie: async (req, res, next) => {
    // schema error
    const schema = new Validator(req.body, {
      name: "required|minLength:1|maxLength:100",
      release_date: "required|date",
      duration: "required|maxLength:50",
      directed_by: "required|maxLength:60",
      genres: "required|array|arrayUnique",
      casts: "required|array|arrayUnique",
      synopsis: "required|maxLength:500",
      poster: "required|url",
    });

    schema.check().then((matched) => {
      if (!matched) {
        res.status(422).json({
          status: false,
          message: schema.errors,
          data: null,
        });
      } else {
        next();
      }
    });
  },
  _addMovie: async (req, res) => {
    try {
      const {
        name,
        release_date,
        duration,
        directed_by,
        genres,
        casts,
        synopsis,
        poster,
      } = req.body;

      const request = await moviesModel.addMovie({
        name,
        release_date,
        duration,
        directed_by,
        genres,
        casts,
        synopsis,
        poster,
      });

      if (request.length > 0) {
        res.json({
          status: true,
          message: "Insert data success",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(502).json({
        status: false,
        message: "Something wrong in our server",
        data: [],
      });
    }
  },
  _editMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const columns = [
        "name",
        "release_date",
        "duration",
        "directed_by",
        "genres",
        "casts",
        "synopsis",
        "poster",
      ];

      const request = await moviesModel.editMovie(req.body, columns, id);

      if (request.length > 0) {
        res.json({
          status: true,
          message: "Update data success",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(502).json({
        status: false,
        message: "Something wrong in our server",
        data: [],
      });
    }
  },
  _deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await modelMovies.deleteMovie(id);

      res.json({
        status: true,
        message: "Delete data success",
        data: request,
      });
    } catch (error) {
      res.status(502).json({
        status: false,
        message: "Something wrong in our server",
        data: [],
      });
    }
  },
};

module.exports = moviesController;
