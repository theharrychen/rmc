require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mountRoutes = require("./routes");

const app = express();

app.use(bodyParser.json());

mountRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
