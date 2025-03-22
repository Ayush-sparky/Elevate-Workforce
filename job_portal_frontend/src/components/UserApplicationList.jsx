import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load applications");
        setLoading(false);
      }
    }

    fetchUserApplications();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "reviewed":
          return "bg-blue-100 text-blue-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        case "shortlisted":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link
          to="/user-dashboard"
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back
        </Link>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            No Applications Found
          </h2>
          <p className="text-gray-600 mb-4">
            You haven't applied to any jobs yet.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link
        to="/user-dashboard"
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back
      </Link>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white">My Job Applications</h1>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {applications.map((application) => (
              <Link
                key={application._id}
                to={`/user-application-detail/${application._id}`}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Check if job exists before accessing its properties */}
                      {application.job ? (
                        <>
                          <h2 className="text-lg font-semibold text-gray-800">
                            {application.job.title}
                          </h2>
                          <div className="flex items-center mt-1">
                            <span className="text-gray-600">
                              {application.company?.name || "Unknown Company"}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-600">
                              {application.job.location || "Unknown Location"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="text-lg font-semibold text-gray-800">
                            [Deleted Job]
                          </h2>
                          <div className="flex items-center mt-1">
                            <span className="text-gray-600">
                              {application.company?.name || "Unknown Company"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span>
                        Applied on {formatDate(application.appliedDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>Updated {formatDate(application.updatedAt)}</span>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-3">
                      <p className="text-gray-600 text-sm line-clamp-2 overflow-hidden">
                        {application.coverLetter.length > 100
                          ? `${application.coverLetter.substring(0, 100)}...`
                          : application.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <span className="text-blue-600 text-sm font-medium">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApplicationsList;
