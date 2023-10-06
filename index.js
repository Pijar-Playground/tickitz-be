require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.APP_PORT;
const cors = require("cors");
const helmet = require("helmet");

// import router
const usersRouter = require('./routers/users');
const moviesRouter = require("./routers/movies");

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
app.use(usersRouter);
app.use(moviesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
