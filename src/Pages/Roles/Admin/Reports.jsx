import { useState, useEffect } from "react";
import { FaDownload, FaChartBar, FaUsers, FaDollarSign } from "react-icons/fa";
import toast from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      userGrowthRate: 0,
    },
    sessionStats: {
      totalSessions: 0,
      completedSessions: 0,
      cancelledSessions: 0,
      averageRating: 0,
    },
    financialStats: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageSessionPrice: 0,
      pendingPayouts: 0,
    },
    recentFeedback: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/reports?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching reports");
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/download?type=${reportType}&timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-report-${timeRange}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error downloading report");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Reports & Analytics
        </h1>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              User Statistics
            </h2>
            <FaUsers className="text-indigo-600 text-xl" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.userStats.totalUsers}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.userStats.activeUsers}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.userStats.newUsersThisMonth}
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport("users")}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <FaDownload className="mr-2" /> Download Report
            </button>
          </div>
        </div>

        {/* Session Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Session Statistics
            </h2>
            <FaChartBar className="text-indigo-600 text-xl" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.sessionStats.totalSessions}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.sessionStats.completedSessions}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.sessionStats.averageRating.toFixed(1)}
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport("sessions")}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <FaDownload className="mr-2" /> Download Report
            </button>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Financial Statistics
            </h2>
            <FaDollarSign className="text-indigo-600 text-xl" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ${reports.financialStats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ${reports.financialStats.monthlyRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-2xl font-bold text-gray-800">
                ${reports.financialStats.pendingPayouts.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleDownloadReport("financial")}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <FaDownload className="mr-2" /> Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Feedback
        </h2>
        <div className="space-y-4">
          {reports.recentFeedback.map((feedback, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {feedback.sessionTopic}
                  </p>
                  <p className="text-sm text-gray-600">
                    {feedback.mentorName} → {feedback.studentName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {feedback.comment}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {feedback.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
