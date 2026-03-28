const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyze");
const symptomsRoute = require("./routes/symptoms");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.use("/api/analyze", analyzeRoute);
app.use("/api/symptoms", symptomsRoute);

app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
