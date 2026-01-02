const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Application = require("../models/Application");

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
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  }
});

/* ================= APPLY JOB (CANDIDATE) ================= */
router.post(
  "/apply/:jobId",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      // Only candidates can apply
      if (req.userRole !== "candidate") {
        return res
          .status(403)
          .json({ message: "Only candidates can apply for jobs" });
      }

      const { jobId } = req.params;

      // Prevent duplicate applications
      const existing = await Application.findOne({
        jobId,
        userId: req.userId
      });

      if (existing) {
        return res.status(400).json({ message: "Already applied" });
      }

      const application = new Application({
        jobId,
        userId: req.userId,
        resume: req.file ? req.file.path : null
      });

      await application.save();

      res.status(201).json({
        message: "Application submitted successfully"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= MY APPLICATIONS (CANDIDATE) ================= */
router.get("/my", auth, async (req, res) => {
  try {
    if (req.userRole !== "candidate") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      userId: req.userId
    }).populate("jobId");

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= APPLICANTS FOR A JOB (EMPLOYER) ================= */
router.get("/job/:jobId", auth, async (req, res) => {
  try {
    // Only employers can view applicants
    if (req.userRole !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      jobId: req.params.jobId
    }).populate("userId");

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE APPLICATION STATUS (EMPLOYER)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    if (req.userRole !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
