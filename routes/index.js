const university = require("./university");

module.exports = (app) => {
  app.use("/university", university);
};