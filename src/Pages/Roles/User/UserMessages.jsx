import { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaSearch,
  FaUser,
  FaExclamationCircle,
  FaComment,
  FaCalendarPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";

const UserMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from token when component mounts
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching conversations with token:", token);

      const response = await fetch(
        "http://localhost:5000/api/messages/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData); // Debug log
        throw new Error(errorData.message || "Failed to fetch conversations");
      }

      const data = await response.json();
      console.log("Raw conversations data:", data);

      if (!Array.isArray(data)) {
        console.error("Unexpected data format:", data); // Debug log
        throw new Error("Invalid data format received from server");
      }

      const formattedConversations = data.map((conv) => ({
        _id: conv.receiverId,
        name: conv.name,
        lastMessage: conv.content,
        timestamp: conv.createdAt,
      }));

      console.log("Formatted conversations:", formattedConversations);
      setConversations(formattedConversations);
      setError(null);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching messages for conversation:", conversationId); // Debug log

      const response = await fetch(
        `http://localhost:5000/api/messages/chat/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      console.log("Fetched messages:", data); // Debug log
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.message);
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem("token");
      const payload = {
        receiverId: selectedConversation._id,
        content: newMessage,
        receiverType: "Mentor",
        senderType: "User",
      };

      console.log("Sending message payload:", payload);

      const response = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to send message");
      }

      const sentMessage = await response.json();
      console.log("Message sent successfully:", sentMessage);

      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
      await fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message);
    }
  };

  const handleRequestSession = async () => {
    if (!selectedConversation) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/user/session-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentorId: selectedConversation._id,
            // Add any additional session details here
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send session request");
      }

      toast.success("Session request sent successfully");
      setShowSessionModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConversationSelect = (conversation) => {
    console.log("Selected conversation:", conversation); // Debug log
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
        <p className="text-gray-700 text-xl">Error loading messages</p>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchConversations}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Conversations Sidebar */}
      <div className="w-1/4 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="space-y-2">
            {conversations
              .filter((conv) =>
                conv.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?._id === conversation._id
                      ? "bg-indigo-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {conversation.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(conversation.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900">
                {selectedConversation.name}
              </div>
              <button
                onClick={() => setShowSessionModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FaCalendarPlus className="mr-2" />
                Request Session
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.senderId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 my-1 ${
                        message.senderId === userId
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === userId
                            ? "text-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaPaperPlane className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No messages yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Start the conversation by sending a message
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <FaComment className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No conversation selected</p>
            <p className="text-gray-400 text-sm mt-2">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>

      {/* Session Request Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Request Session</h2>
            {/* Add session request form here */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSessionModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSession}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMessages;
