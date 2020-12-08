const university = require("./university");
const department = require("./department");
const course = require("./course");
const review = require("./review");
const student = require("./student");
const universityRating = require("./universityRating");

module.exports = (app) => {
  app.use("/university", university);
  app.use("/department", department);
  app.use("/course", course);
  app.use("/review", review);
  app.use("/student", student);
  app.use("/university-rating", universityRating);
};
