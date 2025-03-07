const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { requireAuth } = require("../middleware/authMiddleware");

// All message routes require authentication
router.use(requireAuth);

// Get all conversations for a user
router.get("/conversations", messageController.getConversations);

// Get chat history with a specific user
router.get("/chat/:receiverId", messageController.getChatHistory);

// Send a message
router.post("/send", messageController.sendMessage);

// Mark messages as read
router.put("/read/:senderId", messageController.markAsRead);

// Get unread message count
router.get("/unread/count", messageController.getUnreadCount);

module.exports = router;
