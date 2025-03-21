import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import UserDashboard from "./pages/UserDashboard";
import JobDetails from "./pages/JobDetail"; // Import JobDetails component
import UserApplicationList from "./components/UserApplicationList";
import UserApplicationDetail from "./components/UserApplicationDetail";
import CompanyApplicationDetail from "./components/CompanyApplicationDetail";
import AdminHome from "./components/AdminHome";
import AdminUsersList from "./components/AdminUsersList";
import AdminJobList from "./components/AdminJobList";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/job/:id" element={<JobDetails />} />

          {/* Job details route */}

          {/* Protected routes for job seekers */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route
              path="/user-application-list"
              element={<UserApplicationList />}
            />
            <Route
              path="/user-application-detail/:id"
              element={<UserApplicationDetail />}
            />
          </Route>
          
          {/* Protected routes for companies */}
          <Route element={<ProtectedRoute allowedRoles={["company"]} />}>
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/company-application-detail/:id" element={<CompanyApplicationDetail />} />
          </Route>

          {/* Protected routes for admins */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsersList />} />
              <Route path="jobs" element={<AdminJobList />} />
            </Route>
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
