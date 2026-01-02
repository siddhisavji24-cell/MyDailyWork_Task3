const express = require("express");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");

const router = express.Router();

/* ================= AUTH MIDDLEWARE ================= */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= PUBLIC: GET ALL JOBS ================= */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= EMPLOYER: MY JOBS ================= */
router.get("/my-jobs", auth, async (req, res) => {
  try {
    if (req.userRole !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ createdBy: req.userId }).sort({
      createdAt: -1
    });

    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= EMPLOYER: POST JOB ================= */
router.post("/", auth, async (req, res) => {
  try {
    if (req.userRole !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can post jobs" });
    }

    const job = new Job({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      description: req.body.description,
      createdBy: req.userId
    });

    await job.save();
    res.status(201).json(job);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= PUBLIC: GET SINGLE JOB ================= */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch {
    res.status(404).json({ message: "Job not found" });
  }
});

module.exports = router;
