import { useState, useEffect } from "react";
import { FaSave, FaBell, FaLock, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

const UserSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      sessionReminders: true,
      messageAlerts: true,
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      shareActivity: true,
    },
    preferences: {
      language: "en",
      timezone: "UTC",
      theme: "light",
    },
    security: {
      twoFactorAuth: false,
      sessionRecording: true,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // Merge received data with default settings to ensure all properties exist
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...data,
        notifications: {
          ...prevSettings.notifications,
          ...(data.notifications || {}),
        },
        privacy: { ...prevSettings.privacy, ...(data.privacy || {}) },
        preferences: {
          ...prevSettings.preferences,
          ...(data.preferences || {}),
        },
        security: { ...prevSettings.security, ...(data.security || {}) },
      }));
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching settings");
      setLoading(false);
    }
  };

  const handleToggle = (category, setting) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaBell className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700 capitalize">
                  {key} notifications
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle("notifications", key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaLock className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Profile Visibility</label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) =>
                  handleChange("privacy", "profileVisibility", e.target.value)
                }
                className="border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="mentors">Mentors Only</option>
              </select>
            </div>
            {Object.entries(settings.privacy)
              .filter(([key]) => key !== "profileVisibility")
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-700 capitalize">Show {key}</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleToggle("privacy", key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaClock className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Theme</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) =>
                  handleChange("preferences", "theme", e.target.value)
                }
                className="border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  handleChange("preferences", "language", e.target.value)
                }
                className="border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Timezone</label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) =>
                  handleChange("preferences", "timezone", e.target.value)
                }
                className="border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaLock className="text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Two-Factor Authentication</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={() => handleToggle("security", "twoFactorAuth")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleChange(
                    "security",
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
                min="15"
                max="120"
                className="border rounded-lg px-3 py-2 w-24 focus:ring-indigo-500 focus:border-indigo-500"
              />
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

export default UserSettings;
