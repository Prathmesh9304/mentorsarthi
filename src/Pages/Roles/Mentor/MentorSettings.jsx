import { useState, useEffect } from "react";
import { FaSave, FaBell, FaClock, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

const MentorSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      sessionReminders: true,
      messageAlerts: true,
    },
    availability: {
      timezone: "UTC",
      workingHours: [],
      bufferTime: 15,
      maxSessionsPerDay: 5,
    },
    privacy: {
      profileVisibility: "public",
      showRating: true,
      showReviews: true,
      showEarnings: false,
    },
    security: {
      twoFactorAuth: false,
      sessionRecording: false,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/mentor/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setSettings({
            notifications: {
              email: true,
              push: true,
              sms: false,
              sessionReminders: true,
              messageAlerts: true,
            },
            availability: {
              timezone: "UTC",
              workingHours: [],
              bufferTime: 15,
              maxSessionsPerDay: 5,
            },
            privacy: {
              profileVisibility: "public",
              showRating: true,
              showReviews: true,
              showEarnings: false,
            },
            security: {
              twoFactorAuth: false,
              sessionRecording: false,
            },
          });
        } else {
          throw new Error("Failed to fetch settings");
        }
      } else {
        const data = await response.json();
        setSettings(data);
      }
      setLoading(false);
    } catch (error) {
      if (!error.message.includes("404")) {
        toast.error("Error fetching settings");
      }
      setSettings({
        notifications: {
          email: true,
          push: true,
          sms: false,
          sessionReminders: true,
          messageAlerts: true,
        },
        availability: {
          timezone: "UTC",
          workingHours: [],
          bufferTime: 15,
          maxSessionsPerDay: 5,
        },
        privacy: {
          profileVisibility: "public",
          showRating: true,
          showReviews: true,
          showEarnings: false,
        },
        security: {
          twoFactorAuth: false,
          sessionRecording: false,
        },
      });
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/mentor/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        toast.success("Settings updated successfully");
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      toast.error(error.message);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

      <form onSubmit={handleSubmit}>
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaBell className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Notification Preferences
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) =>
                    handleChange("notifications", "email", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Email Notifications
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) =>
                    handleChange("notifications", "push", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Push Notifications
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.sessionReminders}
                  onChange={(e) =>
                    handleChange(
                      "notifications",
                      "sessionReminders",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Session Reminders
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.messageAlerts}
                  onChange={(e) =>
                    handleChange(
                      "notifications",
                      "messageAlerts",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Message Alerts
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaClock className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Availability Settings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                value={settings.availability.timezone}
                onChange={(e) =>
                  handleChange("availability", "timezone", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                {/* Add more timezone options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                value={settings.availability.bufferTime}
                onChange={(e) =>
                  handleChange(
                    "availability",
                    "bufferTime",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Sessions Per Day
              </label>
              <input
                type="number"
                value={settings.availability.maxSessionsPerDay}
                onChange={(e) =>
                  handleChange(
                    "availability",
                    "maxSessionsPerDay",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaLock className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Privacy Settings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Visibility
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) =>
                  handleChange("privacy", "profileVisibility", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="registered">Registered Users Only</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.privacy.showRating}
                  onChange={(e) =>
                    handleChange("privacy", "showRating", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Rating</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.privacy.showReviews}
                  onChange={(e) =>
                    handleChange("privacy", "showReviews", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Reviews</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FaSave className="mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorSettings;
