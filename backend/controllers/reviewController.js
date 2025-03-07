const Review = require("../models/reviewModel");
const Mentor = require("../models/mentorModel");
const Session = require("../models/sessionModel");

const reviewController = {
  // Create a new review
  createReview: async (req, res) => {
    try {
      const { userId, mentorId, sessionId, rating, comment } = req.body;

      // Verify session exists and is completed
      const session = await Session.findById(sessionId);
      if (!session || session.status !== "completed") {
        return res.status(400).json({
          message: "Can only review completed sessions",
        });
      }

      // Create review
      const review = await Review.create({
        userId,
        mentorId,
        sessionId,
        rating,
        comment,
      });

      // Update mentor's average rating
      const reviews = await Review.find({ mentorId });
      const avgRating =
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

      await Mentor.findByIdAndUpdate(mentorId, {
        rating: avgRating,
        totalReviews: reviews.length,
      });

      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get reviews by mentor ID
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

  // Update review
  updateReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Update mentor's average rating
      const mentorId = review.mentorId;
      const reviews = await Review.find({ mentorId });
      const avgRating =
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

      await Mentor.findByIdAndUpdate(mentorId, {
        rating: avgRating,
      });

      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete review
  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const review = await Review.findByIdAndDelete(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Update mentor's average rating
      const mentorId = review.mentorId;
      const reviews = await Review.find({ mentorId });
      const avgRating = reviews.length
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        : 0;

      await Mentor.findByIdAndUpdate(mentorId, {
        rating: avgRating,
        totalReviews: reviews.length,
      });

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = reviewController;
