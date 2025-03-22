import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const UserApplicationDetail = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserApplications() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/applications/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load application details");
        setLoading(false);
      }
    }

    fetchUserApplications();
  }, []);

  // Find the current application based on the id parameter
  const currentApplication = applications.find((app) => app._id === id);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get time difference
  const getTimeDifference = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "reviewed":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "rejected":
          return "bg-red-100 text-red-800 border-red-200";
        case "shortlisted":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusStyles()}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleGoBack = () => {
    navigate("/user-application-list");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <Link
            to="/user-application-list"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  if (!currentApplication) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-medium text-yellow-800 mb-2">
            Application Not Found
          </h2>
          <p className="text-yellow-700 mb-4">
            The application you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Link
            to="/user-application-list"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View All Applications
          </Link>
        </div>
      </div>
    );
  }

  // Check if the job has been deleted
  const isJobDeleted = !currentApplication.job;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link
              to="/user-application-list"
              className="text-blue-600 hover:text-blue-800"
            >
              Applications
            </Link>
            <svg
              className="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </li>
          <li className="text-gray-600 truncate">
            {isJobDeleted
              ? "Deleted Job"
              : `${currentApplication.job.title} at ${
                  currentApplication.company?.name || "Unknown Company"
                }`}
          </li>
        </ol>
      </nav>

      {isJobDeleted && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-5 w-5 text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Job Listing Removed
            </h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>
                This job listing has been removed by the employer. Your
                application data is still available for your reference.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className={`px-6 py-6 relative ${
            isJobDeleted
              ? "bg-gradient-to-r from-gray-600 to-gray-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-700"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-1">
                {isJobDeleted ? (
                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Deleted Job Position
                  </span>
                ) : (
                  currentApplication.job.title
                )}
              </h1>
              <div className="flex items-center text-blue-100">
                <span>
                  {currentApplication.company?.name || "Unknown Company"}
                </span>
                {!isJobDeleted && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{currentApplication.job.location}</span>
                  </>
                )}
              </div>
            </div>
            <StatusBadge status={currentApplication.status} />
          </div>
        </div>

        {/* Application Summary */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">Applied On</p>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-gray-800 font-medium">
                  {formatDate(currentApplication.appliedDate)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {getTimeDifference(currentApplication.appliedDate)}
              </p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-gray-800 font-medium">
                  {formatDate(currentApplication.updatedAt)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {getTimeDifference(currentApplication.updatedAt)}
              </p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">Contact Number</p>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span className="text-gray-800 font-medium">
                  {currentApplication.phoneNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Content */}
        <div className="px-6 py-4">
          {isJobDeleted && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  This job listing is no longer available
                </h3>
                <p className="text-gray-600 mb-4">
                  The employer may have filled the position or removed the job
                  listing. Your application details are preserved for your
                  records.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/user-dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                  >
                    Browse Available Jobs
                  </Link>
                  <button
                    onClick={handleGoBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                  >
                    Back to Applications
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cover Letter
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">
                {currentApplication.coverLetter}
              </p>
            </div>
          </div>

          {currentApplication.resume && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Resume
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-gray-700 font-medium">Resume File</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <a
                  href={currentApplication.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Application Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Application Timeline
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="border-l-2 border-gray-300 pl-4 ml-2 space-y-6">
                <div className="relative">
                  <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentApplication.appliedDate)}
                  </p>
                  <p className="font-medium text-gray-800">
                    Application Submitted
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    You submitted your application for the{" "}
                    {isJobDeleted ? "position" : currentApplication.job.title}{" "}
                    at {currentApplication.company?.name || "the company"}.
                  </p>
                </div>

                {isJobDeleted && (
                  <div className="relative">
                    <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-gray-500 border-2 border-white"></div>
                    <p className="text-sm text-gray-500">Unknown date</p>
                    <p className="font-medium text-gray-800">
                      Job Listing Removed
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      The employer has removed this job listing. This could mean
                      the position was filled or no longer available.
                    </p>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentApplication.updatedAt)}
                  </p>
                  <p className="font-medium text-gray-800">
                    Application{" "}
                    {currentApplication.status.charAt(0).toUpperCase() +
                      currentApplication.status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentApplication.status === "pending" &&
                      "Your application is waiting to be reviewed by the hiring team."}
                    {currentApplication.status === "reviewed" &&
                      "Your application has been reviewed by the hiring team."}
                    {currentApplication.status === "shortlisted" &&
                      "Congratulations! Your application has been shortlisted for the next stage."}
                    {currentApplication.status === "rejected" &&
                      "Unfortunately, your application was not selected for this position."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
          <div className="mb-4 sm:mb-0">
            <StatusBadge status={currentApplication.status} />
          </div>
          <div className="flex space-x-3">
            <Link
              to="/user-application-list"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Applications
            </Link>
            {!isJobDeleted && currentApplication.status === "shortlisted" && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Contact Employer
              </button>
            )}
            {!isJobDeleted && currentApplication.status === "pending" && (
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Withdraw Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApplicationDetail;
