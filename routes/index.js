const university = require("./university");

const student = require("./student");

module.exports = (app) => {
  app.use("/university", university);

  app.use("/student", student);
};
