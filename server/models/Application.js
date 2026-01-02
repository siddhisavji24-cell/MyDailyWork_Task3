const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",          // 🔴 MUST MATCH Job model name
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",         // 🔴 MUST MATCH User model name
    required: true
  },
  resume: {
    type: String         // stores path like: uploads/12345-resume.pdf
  },
  status: {
    type: String,
    default: "Applied"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", ApplicationSchema);
