const Message = require("../models/messageModel");
const User = require("../models/User");
const Mentor = require("../models/mentorModel");

const messageController = {
  // Get chat history
  getChatHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const receiverId = req.params.receiverId;

      console.log("[getChatHistory] Starting with:", {
        userId,
        userRole,
        receiverId,
      });

      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      }).sort({ createdAt: 1 });

      console.log(
        "[getChatHistory] Found messages:",
        JSON.stringify(messages, null, 2)
      );

      res.status(200).json(messages);
    } catch (error) {
      console.error("[getChatHistory] Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Add this new method for getting conversations
  getConversations: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      console.log("[getConversations] Starting with user:", {
        userId,
        userRole,
      });

      // First, check if the user exists in the appropriate collection
      if (userRole === "mentor") {
        const mentor = await Mentor.findOne({ userId });
        console.log("[getConversations] Found mentor:", mentor);
        if (!mentor) {
          console.log(
            "[getConversations] No mentor profile found for userId:",
            userId
          );
          return res.status(200).json([]);
        }
      }

      // Find all messages where the user is either sender or receiver
      const messageQuery = {
        $or: [{ senderId: userId }, { receiverId: userId }],
      };
      console.log(
        "[getConversations] Message query:",
        JSON.stringify(messageQuery, null, 2)
      );

      const messages = await Message.find(messageQuery).sort({ createdAt: -1 });
      console.log(
        "[getConversations] Raw messages found:",
        JSON.stringify(messages, null, 2)
      );

      if (messages.length === 0) {
        console.log("[getConversations] No messages found for user:", userId);
        return res.status(200).json([]);
      }

      // Create a map to store unique conversations
      const conversationMap = new Map();

      for (const message of messages) {
        console.log("[getConversations] Processing message:", {
          id: message._id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          senderType: message.senderType,
          receiverType: message.receiverType,
        });

        // Determine the other party's ID
        const otherPartyId =
          message.senderId.toString() === userId
            ? message.receiverId.toString()
            : message.senderId.toString();

        if (!conversationMap.has(otherPartyId)) {
          let otherPartyDetails = null;

          if (userRole === "mentor") {
            // If current user is mentor, look up user details
            const user = await User.findById(otherPartyId);
            console.log(
              "[getConversations] Looking up user:",
              otherPartyId,
              "Found:",
              user
            );
            if (user) {
              otherPartyDetails = {
                receiverId: otherPartyId,
                name: `${user.firstName} ${user.lastName}`,
                content: message.content,
                createdAt: message.createdAt,
              };
            }
          } else {
            // If current user is user, look up mentor details
            const mentor = await Mentor.findById(otherPartyId);
            const mentorUser = mentor?.userId
              ? await User.findById(mentor.userId)
              : null;
            console.log(
              "[getConversations] Looking up mentor:",
              otherPartyId,
              "Found:",
              mentorUser
            );
            if (mentorUser) {
              otherPartyDetails = {
                receiverId: otherPartyId,
                name: `${mentorUser.firstName} ${mentorUser.lastName}`,
                content: message.content,
                createdAt: message.createdAt,
              };
            }
          }

          console.log(
            "[getConversations] Created party details:",
            otherPartyDetails
          );
          if (otherPartyDetails) {
            conversationMap.set(otherPartyId, otherPartyDetails);
          }
        }
      }

      const conversations = Array.from(conversationMap.values());
      console.log("[getConversations] Final conversations:", conversations);

      res.status(200).json(conversations);
    } catch (error) {
      console.error("[getConversations] Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Send message
  sendMessage: async (req, res) => {
    try {
      const { receiverId, content, receiverType } = req.body;
      const senderId = req.user.id;
      const senderType = req.user.role === "user" ? "User" : "Mentor"; // Automatically set based on user role

      const message = await Message.create({
        senderId,
        receiverId,
        content,
        senderType,
        receiverType,
        isRead: false,
      });

      console.log("[sendMessage] Created message:", message);

      res.status(201).json(message);
    } catch (error) {
      console.error("[sendMessage] Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { senderId } = req.params;
      const receiverId = req.user.id;

      await Message.updateMany(
        {
          senderId,
          receiverId,
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get unread message count
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user.id;

      const count = await Message.countDocuments({
        receiverId: userId,
        isRead: false,
      });

      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = messageController;
