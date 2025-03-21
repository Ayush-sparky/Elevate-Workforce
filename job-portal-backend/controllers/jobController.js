const Job = require("../models/jobModel");

// Create a new job posting (Protected: Companies only)
const createJob = async (req, res) => {
  try {
    // Check if the user is a company
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Only companies can post jobs" });
    }

    const {
      title,
      description,
      requirements,
      location,
      salary,
      type,
      deadline,
    } = req.body;

    // Create a new job
    const newJob = new Job({
      company: req.user._id, // Link to the company user
      title,
      description,
      requirements,
      location,
      salary,
      type,
      deadline: deadline || null,
      applications: [],
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all jobs posted by the logged-in company (Protected: Companies only)
const getCompanyJobs = async (req, res) => {
  try {
    // Check if the user is a company
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find all jobs posted by this company
    const jobs = await Job.find({ company: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
 
// Get a specific job by ID (Accessible by all users, including normal users)
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name email") // Populate the company information
      .populate("applications.user", "name email"); // Populate applicant details

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update a job posting (Protected: Owner company only)
const updateJob = async (req, res) => {
  try {
    // Check if the user is a company
    if (req.user.role !== "company") {
      return res
        .status(403)
        .json({ message: "Only companies can update jobs" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the logged-in company owns this job
    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own job postings" });
    }

    const {
      title,
      description,
      requirements,
      location,
      salary,
      type,
      deadline,
    } = req.body;

    // Update the job
    job.title = title || job.title;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.type = type || job.type;
    job.deadline = deadline || job.deadline;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a job posting (Protected: Owner company only)
const deleteJob = async (req, res) => {
  try {
    // Check if the user is a company
    if (req.user.role !== "company") {
      return res
        .status(403)
        .json({ message: "Only companies can delete jobs" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the logged-in company owns this job
    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own job postings" });
    }

    await job.deleteOne(); // Using deleteOne instead of remove which is deprecated
    res.json({ message: "Job removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all public jobs (for job seekers) with pagination and filtering
const getAllJobs = async (req, res) => {
  try {
    // Parse pagination params (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // 6 items per page (2 rows of 3 cards)
    const skipIndex = (page - 1) * limit;
    
    // Build filter object based on query parameters
    const filter = {};
    
    // Filter by job type
    if (req.query.type && req.query.type !== 'All') {
      filter.type = req.query.type;
    }
    
    // Filter by location
    if (req.query.location && req.query.location.trim() !== '') {
      filter.location = { $regex: req.query.location, $options: 'i' }; // Case-insensitive search
    }
    
    // Count total filtered jobs
    const totalJobs = await Job.countDocuments(filter);
    
    // Get paginated and filtered jobs
    const jobs = await Job.find(filter)
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex);
    
    res.json({
      jobs,
      page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  getCompanyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAllJobs,
};
