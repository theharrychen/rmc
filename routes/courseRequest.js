const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM course_request");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Getting All From A Student
router.get("/:student_id", async (req, res) => {
  try {
    const {
      rows,
    } = await db.query("SELECT * FROM course_request WHERE student_id = $1", [
      req.params.student_id,
    ]);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Creating One
router.post("/", async (req, res) => {
  const { code, student_id, department_id, subject } = req.body;

  const text =
    "INSERT INTO course_request (code, student_id, department_id, subject) VALUES ($1,$2,$3,$4) RETURNING *;";
  const values = [code, student_id, department_id, subject];

  try {
    const { rows } = await db.query(text, values);
    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

router.post("/approve", async (req, res) => {
  if (
    req.body.courseRequestId &&
    req.body.code &&
    req.body.departmentId &&
    req.body.subject &&
    req.body.adminId
  ) {
    try {
      const {
        courseRequestId,
        code,
        departmentId,
        subject,
        adminId,
      } = req.body;

      await db.query("DELETE FROM course_request WHERE id = $1;", [
        courseRequestId,
      ]);

      const createCourse =
        "INSERT INTO course (code, department_id, subject) VALUES ($1, $2, $3) RETURNING *;";
      const { rows: courseRows } = await db.query(createCourse, [
        code,
        departmentId,
        subject,
      ]);

      const course = courseRows[0];
      const courseId = course.id;

      const createApprove =
        "INSERT INTO approve (course_id, admin_id) VALUES ($1, $2) RETURNING *;";
      const { rows: approveRows } = await db.query(createApprove, [
        courseId,
        adminId,
      ]);

      res.status(201).json([course, approveRows[0]]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message }); // Internal server error
    }
  } else {
    res.status(400).send("The JSON body is missing key-values."); // Bad request from client
  }
});

router.delete("/:id", getCourseRequest, async (req, res) => {
  try {
    await db.query("DELETE FROM course_request WHERE id = $1", [req.params.id]);
    res.json({ message: "Successfully rejected and deleted the course request." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get resource by id
// Called by all "/:id" routes
async function getCourseRequest(req, res, next) {
  const { id } = req.params;
  let course_request;

  try {
    const {
      rows,
      rowCount,
    } = await db.query("SELECT * FROM course_request WHERE id = $1", [id]);

    if (rowCount > 0) {
      course_request = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find course_request" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.course_request = course_request;
  next(); // Moves to next middleware code
}

module.exports = router;
