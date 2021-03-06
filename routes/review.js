const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/:course_id", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM review WHERE course_id = $1", [req.params.course_id]);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Creating One
router.post("/", async (req, res) => {
  const { course_id, student_id, rating, professor, difficulty, comments } = req.body;

  const text =
    "INSERT INTO review (course_id, student_id, rating, professor, difficulty, comments) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;";
  const values = [course_id, student_id, rating, professor, difficulty, comments];

  try {
    const { rows } = await db.query(text, values);
    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

// Updating One
router.put("/:id", getReview, async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.course_id && req.body.student_id && req.body.rating && req.body.professor && req.body.difficulty && req.body.comments) {
      const { course_id, student_id, rating, professor, difficulty, comments } = req.body;
      const text =
        "UPDATE review SET course_id = $1, student_id = $2, rating = $3, professor = $4, difficulty = $5, comments = $6 WHERE id = $7 RETURNING *;";
      const values = [course_id, student_id, rating, professor, difficulty, comments, id];
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

// Middleware function to get resource by id
// Called by all "/:id" routes
async function getReview(req, res, next) {
  const { id } = req.params;
  let review;

  try {
    const {
      rows,
      rowCount,
    } = await db.query("SELECT * FROM review WHERE id = $1", [id]);

    if (rowCount > 0) {
      review = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find review" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.review = review;
  next(); // Moves to next middleware code
}

module.exports = router;
