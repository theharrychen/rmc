const express = require("express");
const router = express.Router();

// Getting All
router.get("/", (req, res) => {});

// Getting One
router.get("/:id", (req, res) => {
  const { id } = req.params;
});

// Creating One
router.post("/", (req, res) => {});

// Updating One
router.put("/:id", (req, res) => {
    const { id } = req.params;
});

// Deleting One
router.delete("/:id", (req, res) => {
    const { id } = req.params;
});

module.exports = router;
