const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "company"], // Restrict roles to these values
      default: "user", // Normal user by default
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
