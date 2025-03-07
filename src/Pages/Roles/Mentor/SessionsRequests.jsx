import { useState, useEffect } from "react";
import {
  FaUser,
  FaClock,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const SessionsRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sessions/mentor/requests?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch session requests");
      }

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setRequests([]);
      setLoading(false);
    }
  };

  const handleRequestAction = async (sessionId, action) => {
    try {
      const token = localStorage.getItem("token");
      const status = action.toLowerCase();

      // Generate meeting link if accepting the session
      const meetingLink =
        status === "accepted"
          ? `https://meet.jit.si/mentorconnect-${sessionId}`
          : null;

      const response = await fetch(
        `http://localhost:5000/api/sessions/requests/${sessionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            meetingLink,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} request`);
      }

      toast.success(`Session request ${action.toLowerCase()} successfully`);
      if (status === "accepted") {
        toast.success("Meeting link generated successfully");
      }
      fetchRequests();
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error(error.message);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const studentName = request.student?.firstName
      ? `${request.student.firstName} ${request.student.lastName}`.toLowerCase()
      : "";
    const topicText = request.topic?.toLowerCase() || "";

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Session Requests</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Show All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredRequests.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferred Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaUser className="text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {request.student
                            ? `${request.student.firstName} ${request.student.lastName}`
                            : "Unknown Student"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.topic || "No Topic"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.scheduledAt
                        ? new Date(request.scheduledAt).toLocaleString()
                        : "No Time Set"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.duration ? `${request.duration} mins` : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === "pending" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            handleRequestAction(request._id, "accepted")
                          }
                          className="text-green-600 hover:text-green-900"
                          title="Accept"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleRequestAction(request._id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <FaClock className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No requests found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === "all"
                ? "No session requests available"
                : filter === "pending"
                ? "You don't have any pending session requests"
                : filter === "accepted"
                ? "No accepted requests yet"
                : "No rejected requests"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsRequests;
