import { useState, useEffect } from "react";
import { FaUser, FaClock, FaTimes, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending"); // pending, accepted, rejected
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sessions/user/requests?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error("Error fetching requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this request?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sessions/requests/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel request");
      }

      toast.success("Request cancelled successfully");
      fetchRequests(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const mentorName = request.mentor
      ? `${request.mentor.firstName} ${request.mentor.lastName}`.toLowerCase()
      : "";
    const topicText = request.topic?.toLowerCase() || "";

    return (
      mentorName.includes(searchTerm.toLowerCase()) ||
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
        <p className="text-gray-700 text-xl">Error loading requests</p>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchRequests}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          My Session Requests
        </h1>
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
                  Mentor
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
                      <FaUser className="text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {request.mentor
                          ? `${request.mentor.firstName} ${request.mentor.lastName}`
                          : "Unknown Mentor"}
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
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Request"
                      >
                        <FaTimes />
                      </button>
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
                ? "You haven't made any session requests yet"
                : filter === "pending"
                ? "You haven't made any pending session requests"
                : `No ${filter} requests`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
