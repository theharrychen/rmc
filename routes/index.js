const university = require("./university");
const department = require("./department");
const course = require("./course");

const student = require("./student");

module.exports = (app) => {
  app.use("/university", university);
  app.use("/department", department);
  app.use("/course", course);
  app.use("/student", student);
};
