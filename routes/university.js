const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM university");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Getting One
router.get("/:id", getUniversity, async (req, res) => {
  res.send(res.university);
});

// Creating One
router.post("/", async (req, res) => {
  const { name, country, province, city, website } = req.body;

  const text =
    "INSERT INTO university (name, country, province, city, website) VALUES ($1,$2,$3,$4,$5) RETURNING *;";
  const values = [name, country, province, city, website];

  try {
    const { rows } = await db.query(text, values);
    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

// Updating One
router.put("/:id", getUniversity, async (req, res) => {
  const { id } = req.params;

  try {
    if (
      req.body.name &&
      req.body.country &&
      req.body.province &&
      req.body.city &&
      req.body.website
    ) {
      const { name, country, province, city, website } = req.body;
      const text =
        "UPDATE university SET name = $1, country = $2, province = $3, city = $4, website = $5 WHERE id = $6 RETURNING *;";
      const values = [name, country, province, city, website, id];
      const { rows } = await db.query(text, values);

      res.json(rows[0]);
    } else {
      res.status(400).json({ message: "Bad Request, your JSON body is missing keys or has null values" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Deleting One
router.delete("/:id", getUniversity, async (req, res) => {
  try {
    await db.query("DELETE FROM university WHERE id = $1", [req.params.id]);
    res.json({ message: "Successfully deleted the university." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get resource by id
// Called by all "/:id" routes
async function getUniversity(req, res, next) {
  const { id } = req.params;
  let university;

  try {
    const {
      rows,
      rowCount,
    } = await db.query("SELECT * FROM university WHERE id = $1", [id]);

    if (rowCount > 0) {
      university = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find university" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.university = university;
  next(); // Moves to next middleware code
}

module.exports = router;
