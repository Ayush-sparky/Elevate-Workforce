const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel"); // Import User model if you need to send notifications
const asyncHandler = require("express-async-handler");

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private
const applyForJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user._id;

  // Verify job exists
  const job = await Job.findById(jobId).populate("company", "email name");
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error("You have already applied for this job");
  }

  // Get resume file path if uploaded
  let resumePath = "";
  if (req.file) {
    resumePath = req.file.path;
  }

  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: userId,
    company: job.company._id,
    coverLetter: req.body.coverLetter || "",
    resume: resumePath,
    phoneNumber: req.body.phoneNumber || "",
  });

  if (application) {
    // Populate the application with user details to send to employer
    const populatedApp = await Application.findById(application._id)
      .populate("applicant", "name email")
      .populate("job", "title");

    // Here you could implement notification to job owner
    // For example, sending an email notification
    // const emailData = {
    //   to: job.company.email,
    //   subject: `New application for ${job.title}`,
    //   text: `You have received a new application from ${populatedApp.applicant.name}`
    // };
    // await sendEmail(emailData); // You would need to implement this function

    res.status(201).json({
      _id: application._id,
      job: application.job,
      status: application.status,
      appliedDate: application.appliedDate,
    });
  } else {
    res.status(400);
    throw new Error("Invalid application data");
  }
});

// @desc    Get all applications for the logged-in user
// @route   GET /api/applications/user
// @access  Private
const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate("job", "title company location")
    .populate("company", "name")
    .sort("-createdAt");

  res.status(200).json(applications);
});

// @desc    Get all applications for the company's jobs
// @route   GET /api/applications/company
// @access  Private (Company only)
const getCompanyApplications = asyncHandler(async (req, res) => {
  // Check if user is a company
  if (req.user.role !== "company") {
    res.status(403);
    throw new Error("Not authorized, company access only");
  }

  const applications = await Application.find({ company: req.user._id })
    .populate("job", "title location")
    .populate("applicant", "name email phoneNumber")
    .sort("-createdAt");

  res.status(200).json(applications);
});

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("job", "title company location description requirements")
    .populate("applicant", "name email phoneNumber")
    .populate("company", "name");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Check if user is authorized to view this application
  if (
    application.applicant._id.toString() !== req.user._id.toString() &&
    application.company._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this application");
  }

  res.status(200).json(application);
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Check if user is the company that posted the job
  if (application.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this application");
  }

  // Update status
  application.status = status;

  // Add notes if provided
  if (req.body.notes) {
    application.notes = req.body.notes;
  }

  const updatedApplication = await application.save();

  res.status(200).json(updatedApplication);
});

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Applicant only)
const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Check if user is the applicant
  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to withdraw this application");
  }

  await application.remove();

  res.status(200).json({ message: "Application withdrawn successfully" });
});

module.exports = {
  applyForJob,
  getUserApplications,
  getCompanyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
};
