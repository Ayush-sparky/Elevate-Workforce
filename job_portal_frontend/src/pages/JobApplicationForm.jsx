import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext"; // Adjust path as needed
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplicationForm = ({ jobId, onApplicationSuccess }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if user is logged in
      if (!currentUser) {
        setError("You must be logged in to apply for jobs");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      // Create form data for file upload
      const applicationData = new FormData();
      applicationData.append("phoneNumber", formData.phoneNumber);
      applicationData.append("coverLetter", formData.coverLetter);

      // Only append if resume is selected
      if (resume) {
        applicationData.append("resume", resume);
      }

      // Submit application
      const response = await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setLoading(false);

      // Call the success callback if provided
      if (onApplicationSuccess) {
        onApplicationSuccess(response.data);
      }

      // Redirect to user dashboard after 2 seconds
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <p className="font-bold">Application Submitted Successfully!</p>
        <p>Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Apply for this Position
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Auto-filled email field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email (from your profile)
          </label>
          <input
            type="email"
            value={currentUser?.email || ""}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            This email is associated with your account
          </p>
        </div>

        {/* Phone number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Resume upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Resume/CV
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>

        {/* Cover letter */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Cover Letter
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="5"
            placeholder="Tell the employer why you're the perfect fit for this role"
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
