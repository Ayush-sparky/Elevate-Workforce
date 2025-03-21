const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createJob,
  getCompanyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAllJobs,
} = require("../controllers/jobController");

// Create a new job posting (Protected: Companies only)
router.post("/", protect, createJob);

// Get all jobs posted by the logged-in company (Protected: Companies only)
router.get("/company", protect, getCompanyJobs);

// Get a specific job by ID
router.get("/:id", getJobById);

// Update a job posting (Protected: Owner company only)
router.put("/:id", protect, updateJob);

// Delete a job posting (Protected: Owner company only)
router.delete("/:id", protect, deleteJob);

// Get all public jobs (for job seekers)
router.get("/", getAllJobs);

module.exports = router;
