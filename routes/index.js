const university = require("./university");
const department = require("./department");
const course = require("./course");

module.exports = (app) => {
  app.use("/university", university);
  app.use("/department", department);
  app.use("/course", course);
};