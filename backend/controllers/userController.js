const User = require("../models/User");
const Mentor = require("../models/mentorModel");

const userController = {
  // Dashboard data
  getDashboard: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(200).json({
        upcomingSessions: [],
        pendingRequests: [],
        recentMessages: [],
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user sessions
  getUserSessions: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(200).json([]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get session requests
  getSessionRequests: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(200).json([]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create session request
  createSessionRequest: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(201).json({ message: "Session request created" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get mentors
  getMentors: async (req, res) => {
    try {
      const { expertise, minRating, maxPrice, availability, search } =
        req.query;
      const query = {
        role: "mentor",
        ...(expertise && { expertise }),
        ...(minRating && { rating: { $gte: Number(minRating) } }),
        ...(maxPrice && { hourlyRate: { $lte: Number(maxPrice) } }),
        ...(search && {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
          ],
        }),
      };

      const mentors = await User.find(query).select("-password");
      res.status(200).json(mentors || []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get conversations
  getConversations: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(200).json([]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single conversation
  getConversation: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(404).json({ message: "Conversation not found" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Send message
  sendMessage: async (req, res) => {
    try {
      const userId = req.user._id;
      res.status(201).json({ message: "Message sent" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user._id;
      const { firstName, lastName, phoneNumber, profileImage } = req.body;

      const updateData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber }),
        ...(profileImage && { profileImage }),
        profileCompleted: true,
      };

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: "user" })
        .select("-password")
        .select("-__v");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user role (admin only)
  updateUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete user (admin only)
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Also delete mentor profile if exists
      await Mentor.findOneAndDelete({ userId: user._id });

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
