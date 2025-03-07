const Mentor = require("../models/mentorModel");
const User = require("../models/User");
const Session = require("../models/sessionModel");
const Review = require("../models/reviewModel");

const mentorController = {
  // Create new mentor profile
  createMentor: async (req, res) => {
    try {
      const { userId, bio, expertise, availability } = req.body;

      // Check if mentor profile already exists
      const existingMentor = await Mentor.findOne({ userId });
      if (existingMentor) {
        return res
          .status(400)
          .json({ message: "Mentor profile already exists" });
      }

      // Create mentor profile
      const mentor = await Mentor.create({
        userId,
        bio: bio || "",
        expertise: expertise || [],
        availability: availability || [],
        rating: 0,
        reviews: [],
      });

      res.status(201).json(mentor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get mentor profile
  getMentorProfile: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const mentor = await Mentor.findById(mentorId)
        .populate("reviews")
        .populate("userId", "firstName lastName email profileImage");

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json(mentor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update mentor profile
  updateMentorProfile: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const updateData = req.body;

      const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { ...updateData },
        { new: true, runValidators: true }
      );

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json(mentor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all mentors
  getAllMentors: async (req, res) => {
    try {
      const mentors = await Mentor.find()
        .populate("reviews")
        .populate("userId", "firstName lastName email profileImage");
      res.status(200).json(mentors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update mentor availability
  updateAvailability: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const { availability, expertise, phone, hourlyRate, bio } = req.body;
      console.log(mentorId);

      const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { availability, expertise, phone, hourlyRate, bio },
        { new: true }
      );

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json(mentor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get mentor reviews
  getMentorReviews: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const reviews = await Review.find({ mentorId })
        .populate("userId", "firstName lastName profileImage")
        .sort({ createdAt: -1 });

      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get mentor sessions
  getMentorSessions: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const sessions = await Session.find({ mentorId })
        .populate("userId", "firstName lastName profileImage")
        .sort({ scheduledAt: -1 });

      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Verify mentor (admin only)
  verifyMentor: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { isVerified: true },
        { new: true }
      );

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json(mentor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = mentorController;
