import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const UserDashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [jobsPerPage] = useState(12); 

  // Filter state
  const [filters, setFilters] = useState({
    type: "All",
    location: "",
  });

  const jobTypes = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Build query string with filters
        let queryParams = new URLSearchParams();
        queryParams.append("page", currentPage);
        queryParams.append("limit", jobsPerPage);

        if (filters.type !== "All") {
          queryParams.append("type", filters.type);
        }

        if (filters.location.trim() !== "") {
          queryParams.append("location", filters.location.trim());
        }

        const url = `http://localhost:5000/api/jobs?${queryParams.toString()}`;
        console.log("Fetching jobs from:", url);
        const response = await axios.get(url);

        if (response.data.jobs) {
          setJobs(response.data.jobs);
          setTotalPages(response.data.totalPages);

          // If we filter and there are no results on the current page, go back to page 1
          if (response.data.jobs.length === 0 && currentPage > 1) {
            setCurrentPage(1);
          }
        } else {
          setJobs([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
        setJobs([]);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser, navigate, currentPage, jobsPerPage, filters]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: "All",
      location: "",
    });
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-3xl">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-8">Elevate Workforce</h2>
        <nav className="space-y-4">
          <Link
            to="/"
            className="block text-lg hover:text-gray-300 cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="#"
            className="block text-lg hover:text-gray-300 cursor-pointer"
          >
            Profile
          </Link>
          <Link
            to="/user-application-list"
            className="block text-lg hover:text-gray-300 cursor-pointer"
          >
            Applications
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {currentUser?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here are the available jobs for you
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Job Type Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City or remote"
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="w-full sm:w-auto">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          {totalPages > 0 ? ` (Page ${currentPage} of ${totalPages})` : ""}
        </div>

        {/* Jobs Section */}
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xxl font-semibold text-gray-900">
                    {job.title}
                  </div>
                  <div className="text-sm text-gray-500">{job.type}</div>
                </div>

                <div className="text-gray-700 mb-4">
                  <p className="text-base">{job.description.slice(0, 80)}...</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Location: {job.location}
                  </div>
                  <Link
                    to={`/job/${job._id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">
              No jobs found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center">
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
