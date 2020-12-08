const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/university/:university_id", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM university_rating WHERE university_id = $1", [req.params.university_id]);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Creating One
router.post("/", async (req, res) => {
  const { university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating } = req.body;

  const text =
    "INSERT INTO university_rating (university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;";
  const values = [university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating];

  try {
    const { rows } = await db.query(text, values);
    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

// Updating One
router.put("/:id", getUniversityRating, async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.university_id && req.body.student_id && req.body.comments && req.body.safety_rating && req.body.facilities_rating && req.body.opportunities_rating) {
      const { university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating } = req.body;
      const text =
        "UPDATE university_rating SET university_id = $1, student_id = $2, comments = $3, safety_rating = $4, facilities_rating = $5, opportunities_rating = $6 WHERE id = $7 RETURNING *;";
      const values = [university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating, id];
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
async function getUniversityRating(req, res, next) {
  const { id } = req.params;
  let university_rating;

  try {
    const {
      rows,
      rowCount,
    } = await db.query("SELECT * FROM university_rating WHERE id = $1", [id]);

    if (rowCount > 0) {
      university_rating = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find university_rating" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.university_rating = university_rating;
  next(); // Moves to next middleware code
}

module.exports = router;
