const User = require("../models/userModel");
const Job = require("../models/jobModel");

// Get all users (Protected: Admin only)
const getAllUsersAdmin = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a user by ID (Protected: Admin only)
const deleteUser = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const userId = req.params.id;

    // Find the user to check their role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is a company, delete all their job postings first
    if (user.role === "company") {
      await Job.deleteMany({ company: userId });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all jobs (Protected: Admin only)
const getAllJobsAdmin = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const jobs = await Job.find()
      .populate("company", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a job by ID (Protected: Admin only)
const deleteJobAdmin = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job listing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all companies (Protected: Admin only)
const getAllCompanies = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const companies = await User.find({ role: "company" }, "-password").sort({
      createdAt: -1,
    });
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all job seekers (Protected: Admin only)
const getAllJobSeekers = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const jobSeekers = await User.find({ role: "user" }, "-password").sort({
      createdAt: -1,
    });
    res.status(200).json(jobSeekers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get dashboard statistics (Protected: Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalJobs = await Job.countDocuments();

    res.status(200).json({
      totalUsers,
      totalCompanies,
      totalJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllUsersAdmin,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
  getAllCompanies,
  getAllJobSeekers,
  getDashboardStats,
};
