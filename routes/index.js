const university = require("./university");
const department = require("./department");
const course = require("./course");
const review = require("./review");
const student = require("./student");
const admin = require("./admin");
const universityRating = require("./universityRating");
const newsPost = require("./newsPost");
const courseRequest = require("./courseRequest");

module.exports = (app) => {
  app.use("/university", university);
  app.use("/department", department);
  app.use("/course", course);
  app.use("/review", review);
  app.use("/student", student);
  app.use("/admin", admin);
  app.use("/university-rating", universityRating);
  app.use("/news-post", newsPost);
  app.use("/course-request", courseRequest);
};
