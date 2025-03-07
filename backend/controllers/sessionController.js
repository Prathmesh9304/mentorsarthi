const Session = require("../models/sessionModel");
const User = require("../models/User");
const Mentor = require("../models/mentorModel");

const sessionController = {
  // Create a new session request
  createSession: async (req, res) => {
    try {
      const { mentorId, topic, description, scheduledAt, duration, price } =
        req.body;
      const studentId = req.user.id; // Get from authenticated user

      console.log("Creating session with:", {
        studentId,
        mentorId,
        topic,
        scheduledAt,
        duration,
        price,
      });

      const session = await Session.create({
        student: studentId,
        mentor: mentorId,
        topic,
        description,
        scheduledAt,
        duration,
        price,
        status: "pending",
      });

      // Populate mentor and student details
      await session.populate([
        { path: "mentor", select: "firstName lastName email profileImage" },
        { path: "student", select: "firstName lastName email profileImage" },
      ]);

      console.log("Session created:", session);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get session by ID
  getSessionById: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await Session.findById(sessionId)
        .populate("mentorId", "firstName lastName profileImage")
        .populate("userId", "firstName lastName profileImage");

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update session status (accept/reject)
  updateSessionStatus: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { status, meetingLink } = req.body;

      const updateData = {
        status,
        ...(meetingLink && { meetingLink }), // Only add meetingLink if it exists
      };

      const session = await Session.findByIdAndUpdate(sessionId, updateData, {
        new: true,
      }).populate("student mentor");

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // If session is accepted, you might want to send notifications
      if (status === "accepted") {
        // You can add notification logic here
        // For example, send emails to both mentor and student with the meeting link
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get mentor's sessions
  getMentorSessions: async (req, res) => {
    try {
      const mentorId = req.user.id;
      const { status } = req.query;

      const sessions = await Session.find({
        mentor: mentorId,
        status: status || "accepted",
      })
        .populate([
          { path: "student", select: "firstName lastName email profileImage" },
          { path: "mentor", select: "firstName lastName email profileImage" },
        ])
        .sort({ scheduledAt: 1 });

      res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get user's sessions
  getUserSessions: async (req, res) => {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const sessions = await Session.find({
        student: userId,
        status: status || "accepted",
      })
        .populate([
          { path: "student", select: "firstName lastName email profileImage" },
          { path: "mentor", select: "firstName lastName email profileImage" },
        ])
        .sort({ scheduledAt: 1 });

      res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Add meeting link to session
  addMeetingLink: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { meetingLink } = req.body;

      const session = await Session.findByIdAndUpdate(
        sessionId,
        { meetingLink },
        { new: true }
      );

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async (req, res) => {
    try {
      const { userId, role } = req.query;
      const query = {
        scheduledAt: { $gt: new Date() },
        status: "confirmed",
      };

      if (role === "mentor") {
        query.mentorId = userId;
      } else {
        query.userId = userId;
      }

      const sessions = await Session.find(query)
        .populate("mentorId", "firstName lastName profileImage")
        .populate("userId", "firstName lastName profileImage")
        .sort({ scheduledAt: 1 });

      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new session request
  createSessionRequest: async (req, res) => {
    try {
      const { mentorId, topic, description, scheduledAt, duration, price } =
        req.body;

      const studentId = req.user.id;

      // Create the session
      const session = await Session.create({
        student: studentId,
        mentor: mentorId,
        topic,
        description,
        scheduledAt,
        duration,
        price,
        status: "pending",
      });

      // Populate mentor and student details
      await session.populate([
        { path: "mentor", select: "firstName lastName email" },
        { path: "student", select: "firstName lastName email" },
      ]);

      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session request:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get session requests for mentor
  getMentorRequests: async (req, res) => {
    try {
      const mentorId = req.user.id;
      const { status } = req.query;

      // Create query object
      const query = { mentor: mentorId };
      // Only add status to query if it's not 'all'
      if (status && status !== "all") {
        query.status = status;
      }

      const requests = await Session.find(query)
        .populate("student", "firstName lastName email")
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get session requests for user
  getUserRequests: async (req, res) => {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      // Create query object
      const query = { student: userId };
      // Only add status to query if it's not 'all'
      if (status && status !== "all") {
        query.status = status;
      }

      const requests = await Session.find(query)
        .populate("mentor", "firstName lastName email")
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel session request (for users)
  cancelSessionRequest: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const studentId = req.user.id;

      const session = await Session.findOne({
        _id: sessionId,
        student: studentId,
      });

      if (!session) {
        return res.status(404).json({ message: "Session request not found" });
      }

      if (session.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Can only cancel pending requests" });
      }

      await Session.deleteOne({ _id: sessionId });
      res
        .status(200)
        .json({ message: "Session request cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = sessionController;
