const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { requireAuth } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(requireAuth);

// Create a new session
router.post("/create", sessionController.createSession);

// Get session requests for mentor
router.get("/mentor/requests", sessionController.getMentorRequests);

// Get session requests for user
router.get("/user/requests", sessionController.getUserRequests);

// Update session status (accept/reject)
router.patch(
  "/requests/:sessionId/status",
  sessionController.updateSessionStatus
);

// Cancel session request (for users)
router.delete("/requests/:sessionId", sessionController.cancelSessionRequest);

// Get session by ID
router.get("/:sessionId", sessionController.getSessionById);

// Get user's sessions
router.get("/user/:userId", sessionController.getUserSessions);

// Add meeting link
router.patch("/:sessionId/meeting-link", sessionController.addMeetingLink);

// Get mentor's sessions
router.get("/mentor/sessions", sessionController.getMentorSessions);

// Get user's sessions
router.get("/user/sessions", sessionController.getUserSessions);

module.exports = router;
