const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { analyzeLabResult } = require("../services/geminiService");

// POST /api/analyze
// Accepts either:
//   - multipart/form-data with a `file` field (image upload)
//   - application/json with a `text` field (pasted text)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    let input = {};

    if (req.file) {
      // Image path
      input.imageBuffer = req.file.buffer;
      input.mimeType = req.file.mimetype;
    } else if (req.body.text) {
      // Text path
      input.text = req.body.text.trim();
    } else {
      return res.status(400).json({ error: "Provide an image file or text input." });
    }

    const result = await analyzeLabResult(input);
    res.json(result);
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: err.message || "Failed to analyze lab result." });
  }
});

module.exports = router;
