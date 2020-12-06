require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.query("INSERT INTO \"user\" VALUES ($1, $2, $3);", [undefined, 'diddle@d.com', 'lkjad;lkfj'], (err, res) => {
  console.log(err);
  console.log(res);
  pool.end();
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
