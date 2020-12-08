const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM course");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Getting One
router.get("/:id", getCourse, async (req, res) => {
  res.send(res.course);
});

// Creating One
router.post("/", async (req, res) => {
  const { code, department_id, subject } = req.body;

  const text =
    "INSERT INTO course (code, department_id, subject) VALUES ($1,$2,$3) RETURNING *;";
  const values = [code, department_id, subject];

  try {
    const { rows } = await db.query(text, values);
    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

// Updating One
router.put("/:id", getCourse, async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.code && req.body.department_id && req.body.subject) {
      const { code, department_id, subject } = req.body;
      const text =
        "UPDATE course SET code = $1, department_id = $2, subject = $3 WHERE id = $4 RETURNING *;";
      const values = [code, department_id, subject, id];
      const { rows } = await db.query(text, values);

      res.json(rows[0]);
    } else {
      res
        .status(400)
        .json({
          message:
            "Bad Request, your JSON body is missing keys or has null values",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Deleting One
router.delete("/:id", getCourse, async (req, res) => {
  try {
    await db.query("DELETE FROM course WHERE id = $1", [req.params.id]);
    res.json({ message: "Successfully deleted the course." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get resource by id
// Called by all "/:id" routes
async function getCourse(req, res, next) {
  const { id } = req.params;
  let course;

  try {
    const {
      rows,
      rowCount,
    } = await db.query("SELECT * FROM course WHERE id = $1", [id]);

    if (rowCount > 0) {
      course = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find course" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.course = course;
  next(); // Moves to next middleware code
}

module.exports = router;
