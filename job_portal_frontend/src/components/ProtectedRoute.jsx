import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/authContext";

// Component to protect routes that require authentication
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has one of the required roles
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on user role
    if (currentUser.role === "company") {
      return <Navigate to="/company-dashboard" replace />;
    } else if (currentUser.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  // If user is authenticated and has required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
