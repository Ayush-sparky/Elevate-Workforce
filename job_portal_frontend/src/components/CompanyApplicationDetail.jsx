import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext"; // Adjust path as needed
import axios from "axios";

const CompanyApplicationDetail = () => {
  const { id } = useParams(); // Get application ID from URL
  const { currentUser } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/applications/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplication(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch application details"
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  // Get a color for the status badge
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-gray-500">
          Application not found or has been deleted.
        </div>
        <Link
          to="/company-dashboard"
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Check if job or applicant data exists
  const hasJobData = application.job && Object.keys(application.job).length > 0;
  const hasApplicantData =
    application.applicant && Object.keys(application.applicant).length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Application Details</h1>
        <Link
          to="/company-dashboard"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">
              {hasApplicantData
                ? "Applicant Information"
                : "Applicant Information (Deleted)"}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                application.status
              )}`}
            >
              {application.status.charAt(0).toUpperCase() +
                application.status.slice(1)}
            </span>
          </div>

          {hasApplicantData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">{application.applicant.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{application.applicant.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-semibold">
                  {application.applicant.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Applied On</p>
                <p className="font-semibold">
                  {formatDate(application.appliedDate)}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-yellow-700">
                The applicant information is no longer available. The user
                account may have been deleted.
              </p>
            </div>
          )}
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2">
            {hasJobData ? "Job Details" : "Job Details (Deleted)"}
          </h2>

          {hasJobData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Job Title</p>
                  <p className="font-semibold">{application.job.title}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold">{application.job.location}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Job Description</p>
                <p className="mt-1">{application.job.description}</p>
              </div>
              <div>
                <p className="text-gray-600">Requirements</p>
                <p className="mt-1">{application.job.requirements}</p>
              </div>
            </>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-yellow-700">
                The job information is no longer available. The job may have
                been deleted.
              </p>
            </div>
          )}
        </div>

        {application.coverLetter && (
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-semibold mb-2">Cover Letter</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{application.coverLetter}</p>
            </div>
          </div>
        )}

        {application.resume && (
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-semibold mb-2">Resume</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">
                <a
                  href={`http://localhost:5000/${application.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Resume
                </a>
              </p>
            </div>
          </div>
        )}

        {application.notes && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Notes</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{application.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Application Timeline</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Application Submitted</p>
              <p className="text-gray-500 text-sm">
                {formatDate(application.createdAt)}
              </p>
            </div>
          </div>

          {application.status !== "pending" && (
            <div className="flex">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold">
                  Application{" "}
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatDate(application.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyApplicationDetail;
