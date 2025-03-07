const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mentor = require("../models/mentorModel");

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        phoneNumber,
        profileImage,
      } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role: role || "user",
        phoneNumber: phoneNumber || "",
        profileImage: profileImage || "",
      });

      // If the user is a mentor, create a mentor profile
      if (role === "mentor") {
        await Mentor.create({
          userId: user._id,
          bio: "",
          expertise: [],
          availability: [],
          rating: 0,
          reviews: [],
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      // Implement forgot password logic here
      res.json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      // Implement reset password logic here
      res.json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
