const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../database");
const router = require("express").Router();

// MIDDLEWARE FUNCTION
const checkJwt = async (req, res, next) => {
  try {
    const token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.APP_SECRET_TOKEN);

    if (decoded) {
      next();
    } else {
      res.status(401).json({
        status: false,
        message: "Token error",
        data: [],
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Token error",
      data: [],
    });
  }
};

// Endpoint users
router.get("/users", async (req, res) => {
  try {
    const request =
      await database`SELECT first_name, last_name, phone_number, photo_profile FROM users`;

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

router.post("/users/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      photo_profile,
    } = req.body;

    const isInputValid =
      first_name &&
      last_name &&
      phone_number &&
      email &&
      password &&
      photo_profile;

    // check if input is valid
    if (!isInputValid) {
      res.status(400).json({
        status: false,
        message: "Bad input, please make sure your input is completed",
      });

      return;
    }

    // check unique email
    const checkEmail =
      await database`SELECT * FROM users WHERE email = ${email}`;

    if (checkEmail.length > 0) {
      res.status(400).json({
        status: false,
        message: "Email is already registered",
      });

      return;
    }

    const saltRounds = 15;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const request = await database`INSERT INTO users
      (first_name, last_name, phone_number, email, password, photo_profile)
    values
      (${first_name}, ${last_name}, ${phone_number}, ${email}, ${hash}, ${photo_profile}) RETURNING id`;

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

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if email registered
    const checkEmail =
      await database`SELECT * FROM users WHERE email = ${email}`;

    if (checkEmail.length == 0) {
      res.status(400).json({
        status: false,
        message: "Email not registered",
      });

      return;
    }

    // check if password correct
    const isMatch = bcrypt.compareSync(password, checkEmail[0].password);

    if (isMatch) {
      const token = jwt.sign(checkEmail[0], process.env.APP_SECRET_TOKEN);

      res.json({
        status: true,
        message: "Login success",
        accessToken: token,
        data: checkEmail,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Password inccorect",
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

router.get("/users/me", checkJwt, async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.APP_SECRET_TOKEN);

    const request =
      await database`SELECT * FROM users WHERE id = ${decoded.id}`;

    res.json({
      status: true,
      message: "GET data success",
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

router.put("/users/edit", checkJwt, async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.APP_SECRET_TOKEN);
    const { id } = decoded;

    const columns = [
      "first_name",
      "last_name",
      "phone_number",
      "email",
      "photo_profile",
    ];

    const request = await database`
      UPDATE users SET ${database(
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
    res.status(502).json({
      status: false,
      message: "Something wrong in our server",
      data: [],
    });
  }
});

router.put("/users/edit/password", checkJwt, async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.APP_SECRET_TOKEN);
    const { id } = decoded;

    const columns = ["password"];

    const saltRounds = 15;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const request = await database`
      UPDATE users SET ${database(
        { password: hash },
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
    res.status(502).json({
      status: false,
      message: "Something wrong in our server",
      data: [],
    });
  }
});

module.exports = router;
