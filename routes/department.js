const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

// Getting All
router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM department");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message }); // Internal Server Error
    }
});

// Getting One
router.get("/:id", getDepartment, async (req, res) => {
    res.send(res.department);
});
  
// Creating One
router.post("/", async (req, res) => {
    const { field, university_id } = req.body;
  
    const text =
        "INSERT INTO department (field, university_id) VALUES ($1,$2) RETURNING *;";
    const values = [field, university_id];
  
    try {
        const { rows } = await db.query(text, values);
        res.status(201).json(rows[0]); // Successfully created record
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message }); // Bad request from client
    }
});
  
// Updating One
router.put("/:id", getDepartment, async (req, res) => {
    const { id } = req.params;
  
    try {
        if (
            req.body.field &&
            req.body.university_id
        ) {
            const { field, university_id } = req.body;
            const text =
                "UPDATE department SET field = $1, university_id = $2 WHERE id = $3 RETURNING *;";
            const values = [field, university_id, id];
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
router.delete("/:id", getDepartment, async (req, res) => {
    try {
        await db.query("DELETE FROM department WHERE id = $1", [req.params.id]);
        res.json({ message: "Successfully deleted the department." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
  
// Middleware function to get resource by id
// Called by all "/:id" routes
async function getDepartment(req, res, next) {
    const { id } = req.params;
    let department;
  
    try {
        const {
            rows,
            rowCount,
        } = await db.query("SELECT * FROM department WHERE id = $1", [id]);
    
        if (rowCount > 0) {
            department = rows[0];
        } else {
            return res.status(404).json({ message: "Cannot find department" }); // Resource not found
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message }); // Internal server error
    }
  
    res.department = department;
    next(); // Moves to next middleware code
}
  
module.exports = router;