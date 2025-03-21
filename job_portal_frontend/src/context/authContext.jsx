import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the Authentication Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults for authentication
  const setupAxiosDefaults = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);

        // Set axios default header for future requests
        setupAxiosDefaults(user.token);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/users/login", {
      email,
      password,
    });

    if (response.data.user && response.data.token) {
      // Ensure token exists
      const user = response.data.user;
      const token = response.data.token; // Extract token

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token); // Store token separately

      setCurrentUser(user);
      setupAxiosDefaults(token); // Set authorization header

      return user;
    } else {
      console.error("Token is missing in response");
    }
  };

  const register = async (userData) => {
    const response = await axios.post(
      "http://localhost:5000/api/users/register",
      userData
    );

    if (response.data.user && response.data.token) {
      // Ensure token exists
      const user = response.data.user;
      const token = response.data.token; // Extract token

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token); // Store token separately

      setCurrentUser(user);
      setupAxiosDefaults(token); // Set authorization header

      return user;
    } else {
      console.error("Token is missing in response");
    }
  };

  // Modify useEffect to retrieve token
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token"); // Retrieve token separately

      if (userData && token) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setupAxiosDefaults(token); // Apply token to axios
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setupAxiosDefaults(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
