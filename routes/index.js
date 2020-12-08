const university = require("./university");
const department = require("./department");

const student = require("./student");

module.exports = (app) => {
  app.use("/university", university);
  app.use("/department", department);
  app.use("/student", student);
};
