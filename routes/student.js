const Router = require("express-promise-router");
const db = require("../db");
const bcrypt = require("bcrypt");

const router = new Router();

// Getting All
router.get("/", async (req, res) => {
  try {
    const text =
      "SELECT S.id AS student_id, U.id AS user_id, university_id, username, email, password " +
      "FROM student AS S, app_user AS U WHERE S.user_id = U.id;";
    const { rows } = await db.query(text);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// Getting One
router.get("/:username", getStudent, async (req, res) => {
  res.send(res.student);
});

// Registering a student
router.post("/", async (req, res) => {
  const { username, email, password, universityId } = req.body;

  try {
    // Hashing and salting the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      res.status(500).send({ message: error.message }); // Server error
    }

    // Create an app_user record
    const {
      rows: userRows,
    } = await db.query(
      "INSERT INTO app_user (username, email, password) VALUES ($1,$2,$3) RETURNING *;",
      [username.toLowerCase(), email.toLowerCase(), hashedPassword]
    );

    // Create a student record with the user_id from the app_user record
    const userId = userRows[0].id;
    await db.query(
      "INSERT INTO student (user_id, university_id) VALUES ($1,$2);",
      [userId, universityId]
    );

    const text =
      "SELECT S.id AS student_id, U.id AS user_id, university_id, username, email, password " +
      "FROM student AS S, app_user AS U WHERE S.user_id = U.id AND U.username = $1;";
    const { rows } = await db.query(text, [userRows[0].username]);

    res.status(201).json(rows[0]); // Successfully created record
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message }); // Bad request from client
  }
});

// Logging in a student
router.post("/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      // Find the student
      const text =
        "SELECT password " +
        "FROM student AS S, app_user AS U WHERE S.user_id = U.id AND U.username = $1;";
      const { rows, rowCount } = await db.query(text, [
        req.body.username.toLowerCase(),
      ]);

      if (rowCount > 0) {
        student = rows[0];
        //Check if the password is correct
        try {
          if (await bcrypt.compare(req.body.password, student.password)) {
            res.send("Successful login!");
          } else {
            res.send("Wrong password!");
          }
        } catch (err) {
          res.status(500).send({ message: err.message }); // Interal server error
        }
      } else {
        return res.status(404).json({ message: "Cannot find student" }); // Resource not found
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "JSON body needs username and password." }); // Bad request from client
  }
});

// // Deleting One
router.delete("/:username", getStudent, async (req, res) => {
  try {
    await db.query("DELETE FROM student WHERE id = $1", [
      res.student.student_id,
    ]);
    await db.query("DELETE FROM app_user WHERE id = $1", [res.student.user_id]);

    res.json({ message: "Successfully deleted the user." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // INternal server error
  }
});

// Middleware function to get resource by id
// Called by all "/:username" routes
async function getStudent(req, res, next) {
  const { username } = req.params;
  let student;

  try {
    const text =
      "SELECT S.id AS student_id, U.id AS user_id, university_id, username, email, password " +
      "FROM student AS S, app_user AS U WHERE S.user_id = U.id AND U.username = $1;";
    const { rows, rowCount } = await db.query(text, [username.toLowerCase()]);

    if (rowCount > 0) {
      student = rows[0];
    } else {
      return res.status(404).json({ message: "Cannot find student" }); // Resource not found
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message }); // Internal server error
  }

  res.student = student;
  next(); // Moves to next middleware code
}

module.exports = router;
