const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(requireAuth);

// Dashboard
router.get("/dashboard", userController.getDashboard);

// Sessions
router.get("/sessions", userController.getUserSessions);
router.get("/session-requests", userController.getSessionRequests);
router.post("/session-requests", userController.createSessionRequest);

// Mentors
router.get("/mentors", userController.getMentors);

// Conversations
router.get("/conversations", userController.getConversations);
router.get("/conversations/:conversationId", userController.getConversation);
router.post(
  "/conversations/:conversationId/messages",
  userController.sendMessage
);

// Profile
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);

module.exports = router;
