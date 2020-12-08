const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM news_post");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Getting One
router.get("/:id", getNewsPost, async (req, res) => {
    res.send(res.news_post);
  });

// Creating One
router.post("/", async (req, res) => {
  const { admin_id, title, body } = req.body;

  const text =
    "INSERT INTO news_post (admin_id, title, body) VALUES ($1,$2,$3) RETURNING *;";
  const values = [admin_id, title, body];

  try {
    const { rows } = await db.query(text, values);
    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

// Updating One
router.put("/:id", getNewsPost, async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.admin_id && req.body.title && req.body.body) {
      const { admin_id, title, body } = req.body;
      const text =
        "UPDATE news_post SET admin_id = $1, title = $2, body = $3 WHERE id = $4 RETURNING *;";
      const values = [admin_id, title, body, id];
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
router.delete("/:id", getNewsPost, async (req, res) => {
    try {
      await db.query("DELETE FROM news_post WHERE id = $1", [req.params.id]);
      res.json({ message: "Successfully deleted the news_post." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

// Middleware function to get resource by id
// Called by all "/:id" routes
async function getNewsPost(req, res, next) {
  const { id } = req.params;
  let news_post;

  try {
    const {
      rows,
      rowCount,
    } = await db.query("SELECT * FROM news_post WHERE id = $1", [id]);

    if (rowCount > 0) {
      news_post = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find news_post" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.news_post = news_post;
  next(); // Moves to next middleware code
}

module.exports = router;
