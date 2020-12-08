const university = require("./university");
const department = require("./department");

module.exports = (app) => {
  app.use("/university", university);
  app.use("/department", department);
};