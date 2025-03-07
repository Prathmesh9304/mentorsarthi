import { useState, useEffect } from "react";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaUserGraduate,
  FaComments,
  FaCalendarPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FindAMentor = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    expertise: "",
    minRating: 0,
    maxPrice: "",
    availability: "",
  });
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({
    topic: "",
    description: "",
    scheduledAt: "",
    duration: 60,
  });

  useEffect(() => {
    fetchMentors();
  }, [filters]);

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        ...filters,
        search: searchTerm,
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/mentors/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mentors");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data received from server");
      }

      setMentors(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Error fetching mentors");
      setMentors([]);
      setLoading(false);
    }
  };

  const openSessionModal = (mentor) => {
    setSelectedMentor(mentor);
    setShowSessionModal(true);
  };

  const handleRequestSession = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Selected Mentor:", selectedMentor); // Debug log
      console.log("Session Details:", sessionDetails); // Debug log

      const response = await fetch(
        "http://localhost:5000/api/sessions/create", // Updated endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentorId: selectedMentor.userId._id, // Fix: Use userId._id instead of _id
            topic: sessionDetails.topic,
            description: sessionDetails.description,
            scheduledAt: sessionDetails.scheduledAt,
            duration: parseInt(sessionDetails.duration),
            price:
              selectedMentor.hourlyRate *
              (parseInt(sessionDetails.duration) / 60),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send session request");
      }

      const data = await response.json();
      console.log("Session created:", data); // Debug log

      toast.success("Session request sent successfully");
      setShowSessionModal(false);
      setSessionDetails({
        topic: "",
        description: "",
        scheduledAt: "",
        duration: 60,
      });
    } catch (error) {
      console.error("Error creating session:", error); // Debug log
      toast.error(error.message || "Failed to create session request");
    }
  };

  const initiateChat = async (mentorId, mentorName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: mentorId,
          content: `Hi, I'm interested in your mentoring services.`,
          receiverType: "Mentor",
          initiateChat: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate chat");
      }

      const data = await response.json();
      console.log("Chat initiated:", data);

      toast.success(`Chat initiated with ${mentorName}`);
      navigate("/user/messages");
    } catch (error) {
      console.error("Chat initiation error:", error);
      toast.error(error.message);
    }
  };

  // Helper function to get initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const renderExpertise = (expertise) => {
    if (!expertise || expertise.length === 0) return "No expertise listed";
    return expertise.join(", ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Find a Mentor</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => {
              /* Open filters modal */
            }}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center">
                    {mentor.userId.profileImage ? (
                      <img
                        src={mentor.userId.profileImage}
                        alt={`${mentor.userId.firstName} ${mentor.userId.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {getInitials(
                          mentor.userId.firstName,
                          mentor.userId.lastName
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {mentor.userId.firstName} {mentor.userId.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {renderExpertise(mentor.expertise)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {mentor.rating ? mentor.rating.toFixed(1) : "New"}
                    <span className="text-gray-400 text-xs ml-1">
                      ({mentor.reviews.length} reviews)
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Email:</span>
                  <a
                    href={`mailto:${mentor.userId.email}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {mentor.userId.email}
                  </a>
                </div>
                {mentor.userId.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Phone:</span>
                    <a
                      href={`tel:${mentor.userId.phoneNumber}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {mentor.userId.phoneNumber}
                    </a>
                  </div>
                )}
              </div>

              <p className="mt-4 text-gray-600">
                {mentor.bio || "No bio available"}
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Availability
                </h4>
                {mentor.availability && mentor.availability.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {mentor.availability.map((slot, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                      >
                        {slot.day} {slot.time}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No availability set</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  ${mentor.hourlyRate || "Rate not set"}/hour
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      initiateChat(
                        mentor._id,
                        `${mentor.userId.firstName} ${mentor.userId.lastName}`
                      )
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    <FaComments className="mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => openSessionModal(mentor)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center"
                    disabled={
                      !mentor.availability || mentor.availability.length === 0
                    }
                  >
                    <FaCalendarPlus className="mr-2" />
                    Request Session
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <FaUserGraduate className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No mentors found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Session Request Modal */}
      {showSessionModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Request Session with {selectedMentor.userId.firstName}
            </h2>
            <form onSubmit={handleRequestSession}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionDetails.topic}
                    onChange={(e) =>
                      setSessionDetails({
                        ...sessionDetails,
                        topic: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={sessionDetails.description}
                    onChange={(e) =>
                      setSessionDetails({
                        ...sessionDetails,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={sessionDetails.scheduledAt}
                    onChange={(e) =>
                      setSessionDetails({
                        ...sessionDetails,
                        scheduledAt: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <select
                    value={sessionDetails.duration}
                    onChange={(e) =>
                      setSessionDetails({
                        ...sessionDetails,
                        duration: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div className="text-right space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSessionModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindAMentor;
