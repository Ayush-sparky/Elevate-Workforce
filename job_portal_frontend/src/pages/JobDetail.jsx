import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext"; // Adjust path as needed
import ApplicationForm from "./JobApplicationForm"; // Import the application form component

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/jobs/${id}`
        );
        setJob(response.data);

        // Check if user has already applied
        if (currentUser) {
          try {
            const token = localStorage.getItem("token");
            const applicationsResponse = await axios.get(
              "http://localhost:5000/api/applications/user",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // Check if any applications match this job
            const applied = applicationsResponse.data.some(
              (app) => app.job._id === id
            );
            setHasApplied(applied);
          } catch (err) {
            console.error("Error checking application status:", err);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load job details");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, currentUser]);

  const handleApplyClick = () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    setShowApplicationForm(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">Loading job details...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!job) {
    return <div className="text-center mt-10">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-lg mt-10">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back
        className="cursor-pointer mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
      >
        Go Back
      </button>

      {/* Job Title and Company Name */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        {job.title}
      </h1>
      <p className="text-xl text-gray-600">{job.company.name}</p>

      {/* Job Description */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Job Description
        </h2>
        <p className="mt-2 text-lg text-gray-700">{job.description}</p>
      </div>

      {/* Job Requirements */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800">Requirements</h2>
        <p className="mt-2 text-lg text-gray-700">{job.requirements}</p>
      </div>

      {/* Job Location and Salary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Location</h3>
          <p className="text-lg text-gray-700">{job.location}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Salary</h3>
          <p className="text-lg text-gray-700">{job.salary}</p>
        </div>
      </div>

      {/* Job Type and Deadline */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Job Type</h3>
          <p className="text-lg text-gray-700">{job.type}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Application Deadline
          </h3>
          <p className="text-lg text-gray-700">
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "No deadline specified"}
          </p>
        </div>
      </div>

      {/* Job Application Button or Already Applied Message */}
      <div className="mt-6">
        {hasApplied ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            You have already applied for this position.
          </div>
        ) : showApplicationForm ? (
          <ApplicationForm
            jobId={id}
            onApplicationSuccess={handleApplicationSuccess}
          />
        ) : (
          <button
            onClick={handleApplyClick}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
