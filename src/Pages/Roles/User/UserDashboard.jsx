import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaStar,
  FaGraduationCap,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSessions: 0,
    upcomingSessions: [],
    completedSessions: 0,
    averageRating: 0,
    recentMentors: [],
    sessionsByStatus: {
      pending: 0,
      accepted: 0,
      completed: 0,
      rejected: 0,
    },
    totalSpent: 0,
    nextSession: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData({
        totalSessions: data.totalSessions || 0,
        upcomingSessions: data.upcomingSessions || [],
        completedSessions: data.completedSessions || 0,
        averageRating: data.averageRating || 0,
        recentMentors: data.recentMentors || [],
        sessionsByStatus: data.sessionsByStatus || {
          pending: 0,
          accepted: 0,
          completed: 0,
          rejected: 0,
        },
        totalSpent: data.totalSpent || 0,
        nextSession: data.nextSession || null,
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

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
        <p className="text-gray-700 text-xl">Error loading dashboard</p>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Student Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaCalendarCheck className="text-indigo-600 text-2xl" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaClock className="text-green-600 text-2xl" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Upcoming Sessions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.upcomingSessions?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaGraduationCap className="text-blue-600 text-2xl" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Completed Sessions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.completedSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaStar className="text-yellow-400 text-2xl" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.averageRating
                  ? dashboardData.averageRating.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Session Card (if exists) */}
      {dashboardData.nextSession && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Next Session
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">
                {dashboardData.nextSession.mentorName}
              </p>
              <p className="text-sm text-gray-600">
                {dashboardData.nextSession.topic}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(
                  dashboardData.nextSession.scheduledAt
                ).toLocaleString()}
              </p>
            </div>
            {dashboardData.nextSession.meetingLink && (
              <button
                onClick={() => {
                  const width = 800;
                  const height = 600;
                  const left = (window.screen.width - width) / 2;
                  const top = (window.screen.height - height) / 2;
                  window.open(
                    dashboardData.nextSession.meetingLink,
                    "MentorConnect Meeting",
                    `width=${width},height=${height},left=${left},top=${top}`
                  );
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Join Session
              </button>
            )}
          </div>
        </div>
      )}

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
            to="/user/sessions"
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            View all sessions
          </Link>
        </div>
        <div className="space-y-4">
          {dashboardData.upcomingSessions?.length > 0 ? (
            dashboardData.upcomingSessions.map((session) => (
              <div
                key={session._id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {session.mentorName}
                  </p>
                  <p className="text-sm text-gray-600">{session.topic}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(session.scheduledAt).toLocaleString()}
                  </p>
                </div>
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Join Session
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No upcoming sessions</p>
              <Link
                to="/find-mentor"
                className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block"
              >
                Find a mentor
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Mentors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Mentors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.recentMentors?.length > 0 ? (
            dashboardData.recentMentors.map((mentor) => (
              <div key={mentor._id} className="border rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaGraduationCap className="text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-600">
                      {mentor.expertise?.join(", ") || "No expertise listed"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sessions completed: {mentor.sessionsCompleted || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4">
              <p className="text-gray-500">No recent mentors</p>
              <Link
                to="/find-mentor"
                className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block"
              >
                Start learning with a mentor
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
