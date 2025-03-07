import { useState, useEffect } from "react";
import { FaCalendarCheck, FaUsers, FaStar, FaDollarSign } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MentorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSessions: 0,
    totalStudents: 0,
    averageRating: 0,
    totalEarnings: 0,
    upcomingSessions: [],
    recentReviews: [],
    pendingRequests: 0,
    completedSessions: 0,
    sessionsByStatus: {
      pending: 0,
      accepted: 0,
      completed: 0,
      rejected: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/mentor/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setDashboardData({
            totalSessions: 0,
            totalStudents: 0,
            averageRating: 0,
            totalEarnings: 0,
            upcomingSessions: [],
            recentReviews: [],
            pendingRequests: 0,
            completedSessions: 0,
            sessionsByStatus: {
              pending: 0,
              accepted: 0,
              completed: 0,
              rejected: 0,
            },
          });
        } else {
          throw new Error("Failed to fetch dashboard data");
        }
      } else {
        const data = await response.json();
        setDashboardData(data);
      }
      setLoading(false);
    } catch (error) {
      if (!error.message.includes("404")) {
        toast.error("Error fetching dashboard data");
      }
      setDashboardData({
        totalSessions: 0,
        totalStudents: 0,
        averageRating: 0,
        totalEarnings: 0,
        upcomingSessions: [],
        recentReviews: [],
        pendingRequests: 0,
        completedSessions: 0,
        sessionsByStatus: {
          pending: 0,
          accepted: 0,
          completed: 0,
          rejected: 0,
        },
      });
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Mentor Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaCalendarCheck className="text-3xl text-indigo-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData.totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaUsers className="text-3xl text-indigo-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaStar className="text-3xl text-indigo-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaDollarSign className="text-3xl text-indigo-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">
                ${dashboardData.totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Status Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Sessions Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">
              {dashboardData.sessionsByStatus.pending}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-600 text-sm">Accepted</p>
            <p className="text-2xl font-bold text-green-700">
              {dashboardData.sessionsByStatus.accepted}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-blue-700">
              {dashboardData.sessionsByStatus.completed}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-700">
              {dashboardData.sessionsByStatus.rejected}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Sessions
          </h2>
          <Link
            to="/mentor/sessions"
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            View all sessions
          </Link>
        </div>
        <div className="overflow-x-auto">
          {dashboardData.upcomingSessions.length > 0 ? (
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
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.upcomingSessions.map((session) => (
                  <tr key={session._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.topic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(session.scheduledAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.duration} mins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.meetingLink && (
                        <button
                          onClick={() => {
                            const width = 800;
                            const height = 600;
                            const left = (window.screen.width - width) / 2;
                            const top = (window.screen.height - height) / 2;
                            window.open(
                              session.meetingLink,
                              "MentorConnect Meeting",
                              `width=${width},height=${height},left=${left},top=${top}`
                            );
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Join Meeting
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <FaCalendarCheck className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No upcoming sessions</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reviews with Ratings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Reviews
        </h2>
        {dashboardData.recentReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.recentReviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {review.sessionTopic}
                    </p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-700">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaStar className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
