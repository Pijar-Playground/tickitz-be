require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.APP_PORT;
const database = require("./database");
const cors = require("cors");
const helmet = require("helmet");

// grant access for express can accept input from outside
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// grant access for all client using this resource
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
// using helmet
app.use(helmet());

// ENDPOINT MOVIES
app.get("/movies", async (req, res) => {
  try {
    const request =
      await database`SELECT id, name, duration, genres, poster FROM movies`;

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
});

app.get("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await database`SELECT * FROM movies WHERE id = ${id}`;

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
});

app.post("/movies", async (req, res) => {
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

    const isInputValid =
      name &&
      release_date &&
      duration &&
      directed_by &&
      genres &&
      casts &&
      synopsis &&
      poster;

    // check if input is valid
    if (!isInputValid) {
      res.status(400).json({
        status: false,
        message: "Bad input, please make sure your input is completed",
      });
    }

    const request = await database`INSERT INTO movies
      (name, release_date, duration, directed_by, genres, casts, synopsis, poster)
    values
      (${name}, ${release_date}, ${duration}, ${directed_by}, ${genres}, ${casts}, ${synopsis}, ${poster}) RETURNING id`;

    if (request.length > 0) {
      res.json({
        status: true,
        message: "Insert data success",
      });
    }
  } catch (error) {
    res.status(502).json({
      status: false,
      message: "Something wrong in our server",
      data: [],
    });
  }
});

app.put("/movies/:id", async (req, res) => {
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

    const request = await database`
      UPDATE movies SET ${database(
        req.body,
        columns
      )} WHERE id = ${id} RETURNING id
    `;

    if (request.length > 0) {
      res.json({
        status: true,
        message: "Update data success",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(502).json({
      status: false,
      message: "Something wrong in our server",
      data: [],
    });
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await database`DELETE FROM movies WHERE id = ${id}`;

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
});

// ENDPOINT CINEMAS

// ENDPOINT USERS

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
