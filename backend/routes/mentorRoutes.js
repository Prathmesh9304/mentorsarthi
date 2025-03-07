const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const Mentor = require("../models/mentorModel");
const User = require("../models/User");

// Debug middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
router.get("/all", async (req, res) => {
  try {
    const { expertise, minRating, maxPrice, availability, search } = req.query;

    let query = {};

    // Apply filters
    if (expertise) {
      query.expertise = { $in: [expertise] };
    }
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const mentors = await Mentor.find(query)
      .populate("userId", "firstName lastName email profileImage")
      .sort({ rating: -1 });

    // Apply search filter after population
    let filteredMentors = mentors;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filteredMentors = mentors.filter(
        (mentor) =>
          searchRegex.test(mentor.userId.firstName) ||
          searchRegex.test(mentor.userId.lastName) ||
          searchRegex.test(mentor.expertise.join(" ")) ||
          searchRegex.test(mentor.bio)
      );
    }

    res.status(200).json(filteredMentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile/:clerkId", mentorController.getMentorProfile);

// Protected routes (require authentication)
router.post("/create", requireAuth, mentorController.createMentor);
router.put("/profile", requireAuth, async (req, res) => {
  console.log("Received profile update request");
  console.log("Body:", req.body);
  console.log("User:", req.user);

  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      bio,
      expertise,
      availability,
      hourlyRate,
    } = req.body;

    // Update user basic info
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phoneNumber,
      },
      { new: true }
    );

    // Find or create mentor profile
    let mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      mentor = new Mentor({
        userId: req.user._id,
        bio: "",
        expertise: [],
        availability: [],
        hourlyRate: 0,
      });
    }

    // Update mentor-specific fields
    mentor.bio = bio;
    mentor.expertise = expertise;
    mentor.availability = availability;
    mentor.hourlyRate = parseFloat(hourlyRate);

    await mentor.save();

    // Combine user and mentor data
    const profileData = {
      ...updatedUser.toObject(),
      bio: mentor.bio,
      expertise: mentor.expertise,
      availability: mentor.availability,
      hourlyRate: mentor.hourlyRate,
      rating: mentor.rating,
      reviews: mentor.reviews,
    };

    console.log("Sending updated profile:", profileData);
    res.json(profileData);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileData = {
      ...user.toObject(),
      bio: mentor?.bio || "",
      expertise: mentor?.expertise || [],
      availability: mentor?.availability || [],
      hourlyRate: mentor?.hourlyRate || 0,
      rating: mentor?.rating || 0,
      reviews: mentor?.reviews || [],
    };

    res.json(profileData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.put(
  "/availability/:mentorId",
  requireAuth,
  mentorController.updateAvailability
);
router.get("/reviews/:mentorId", mentorController.getMentorReviews);
router.get(
  "/sessions/:mentorId",
  requireAuth,
  mentorController.getMentorSessions
);

// Admin only routes
router.put(
  "/verify/:mentorId",
  requireAuth,
  requireAdmin,
  mentorController.verifyMentor
);

// Test route to verify the router is working
router.get("/test", (req, res) => {
  res.json({ message: "Mentor routes are working" });
});

module.exports = router;
