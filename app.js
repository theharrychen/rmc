require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const universityRouter = require('./routes/university');
app.use("/university", universityRouter);


app.get("/", (req, res) => {
  console.log(req);
  res.json({ key: "value" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
