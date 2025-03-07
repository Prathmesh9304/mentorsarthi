const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { requireAuth } = require("../middleware/authMiddleware");

// Public routes
router.get("/mentor/:mentorId", reviewController.getMentorReviews);

// Protected routes
router.use(requireAuth);
router.post("/create", reviewController.createReview);
router.put("/:reviewId", reviewController.updateReview);
router.delete("/:reviewId", reviewController.deleteReview);

module.exports = router;
