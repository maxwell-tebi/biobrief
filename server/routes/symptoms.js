const express = require("express");
const router = express.Router();
const { analyzeSymptoms } = require("../services/geminiService");

// POST /api/symptoms
router.post("/", async (req, res) => {
  const { symptoms, flagged } = req.body;
  if (!symptoms || !Array.isArray(flagged)) {
    return res.status(400).json({ error: "Provide symptoms text and flagged array." });
  }
  try {
    const result = await analyzeSymptoms({ symptoms, flagged });
    res.json(result);
  } catch (err) {
    console.error("Symptoms error:", err.message);
    res.status(500).json({ error: err.message || "Failed to analyze symptoms." });
  }
});

module.exports = router;
