const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  createAdmin,
} = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

// Fetch All Users Route
router.get("/", getAllUsers);

router.post("/admin/create", createAdmin);

module.exports = router;
