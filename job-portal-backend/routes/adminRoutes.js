const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getAllUsersAdmin,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
  getAllCompanies,
  getAllJobSeekers,
  getDashboardStats,
} = require("../controllers/adminController");

// Admin dashboard statistics
router.get("/dashboard", protect, getAllUsersAdmin);

// User management routes
router.get("/users", protect, getAllUsersAdmin);
router.delete("/users/:id", protect, deleteUser);

// Company management routes
router.get("/companies", protect, getAllCompanies);

// Job seeker management routes
router.get("/job-seekers", protect, getAllJobSeekers);

// Job management routes
router.get("/jobs", protect, getAllJobsAdmin);
router.delete("/jobs/:id", protect, deleteJobAdmin);

// Dashboard statistics
router.get("/stats", protect, getDashboardStats);

module.exports = router;
