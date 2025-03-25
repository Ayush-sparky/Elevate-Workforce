import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  Briefcase,
  CircleUser,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/admin/stats"
        );
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(
          "Failed to load dashboard statistics. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-black">{value}</h2>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border-", "bg-")
            .replace("-500", "-100")}`}
        >
          <Icon size={24} className={color.replace("border-", "text-")} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin dashboard</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center">
          <AlertTriangle className="mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Job Seekers"
          value={stats.totalUsers}
          icon={CircleUser}
          color="border-blue-500"
        />
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
          color="border-purple-500"
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="border-green-500"
        />
      </div>

      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin-dashboard/users")}
            className=" cursor-pointer flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users size={18} />
            Manage Users
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/users")}
            className=" cursor-pointer flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Building2 size={18} />
            Manage Companies
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/jobs")}
            className=" cursor-pointer flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Briefcase size={18} />
            Manage Jobs
          </button>
          <button className=" cursor-pointer flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
            <AlertTriangle size={18} />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
