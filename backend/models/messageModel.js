const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    senderType: {
      type: String,
      enum: ["User", "Mentor"],
      required: true,
    },
    receiverType: {
      type: String,
      enum: ["User", "Mentor"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    conversationInitiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ conversationInitiator: 1 });

module.exports = mongoose.model("Message", messageSchema);
