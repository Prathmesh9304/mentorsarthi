import { useState, useEffect } from "react";
import {
  FaCalendar,
  FaClock,
  FaUser,
  FaVideo,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("accepted");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sessions/mentor/sessions?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error("Error fetching sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Session ${newStatus} successfully`);
        fetchSessions();
      } else {
        throw new Error(`Failed to ${newStatus} session`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const studentName = session.student
      ? `${session.student.firstName} ${session.student.lastName}`.toLowerCase()
      : "";
    const topicText = session.topic?.toLowerCase() || "";

    return (
      studentName.includes(searchTerm.toLowerCase()) ||
      topicText.includes(searchTerm.toLowerCase())
    );
  });

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
        <p className="text-gray-700 text-xl">Error loading sessions</p>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchSessions}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Sessions</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div key={session._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaUser className="text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {session.student
                        ? `${session.student.firstName} ${session.student.lastName}`
                        : "Unknown Student"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {session.topic || "No topic specified"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === "accepted"
                      ? "bg-yellow-100 text-yellow-800"
                      : session.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {session.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendar className="mr-2" />
                  {new Date(session.scheduledAt).toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="mr-2" />
                  {session.duration} minutes
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                {session.status === "accepted" && (
                  <button
                    onClick={() => {
                      if (session.meetingLink) {
                        const width = 800;
                        const height = 600;
                        const left = (window.screen.width - width) / 2;
                        const top = (window.screen.height - height) / 2;

                        window.open(
                          session.meetingLink,
                          "MentorConnect Meeting",
                          `width=${width},height=${height},left=${left},top=${top}`
                        );
                      } else {
                        toast.error("Meeting link not available");
                      }
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <FaVideo className="mr-2" />
                    Join Session
                  </button>
                )}
                {session.status === "completed" && (
                  <div className="text-sm text-gray-600">Session completed</div>
                )}
                {session.status === "rejected" && (
                  <div className="text-sm text-gray-600">Session rejected</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <FaCalendar className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No sessions found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === "accepted"
                ? "You don't have any accepted sessions"
                : filter === "completed"
                ? "No completed sessions yet"
                : "No rejected sessions"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;
