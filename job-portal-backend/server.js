const express = require("express");
const cors = require("cors"); // Import CORS
require("dotenv").config();

const app = express();
const jobRoutes = require("./routes/jobRoutes"); // Import job routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");

const Job = require("./models/jobModel"); // Import Job Model

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies if needed
  })
);

// Connect to MongoDB

// Middleware to parse JSON bodies
app.use(express.json()); // This must be present!

connectDB();

// Use the routes
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
