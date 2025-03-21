const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const {
  applyForJob,
  getUserApplications,
  getCompanyApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication,
} = require("../controllers/applicationController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes/");
  },
  filename: function (req, file, cb) {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx|txt/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX and TXT files are allowed!"), false);
  }
};

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Apply for a job with resume upload
router.post("/:jobId", protect, upload.single("resume"), applyForJob);

// Get all applications for the logged-in user
router.get("/user", protect, getUserApplications);

// Get all applications for the company's jobs
router.get("/company", protect, getCompanyApplications);

// Get specific application
router.get("/:id", protect, getApplicationById);

// Update application status (company only)
router.put("/:id/status", protect, updateApplicationStatus);

// Withdraw application (applicant only)
router.delete("/:id", protect, withdrawApplication);

module.exports = router;
