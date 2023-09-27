const postgres = require("postgres");

const sql = postgres({
  host: "localhost",
  user: "postgres",
  pass: "root",
  database: "tickitz",
  port: 5432,
});

module.exports = sql;