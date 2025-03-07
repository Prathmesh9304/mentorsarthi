import { useState, useEffect } from "react";
import { FaSave, FaCog } from "react-icons/fa";
import toast from "react-hot-toast";

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      platformName: "",
      supportEmail: "",
      maintenanceMode: false,
      allowRegistration: true,
    },
    session: {
      minSessionDuration: 30,
      maxSessionDuration: 120,
      cancellationPolicy: "",
      platformFeePercentage: 10,
    },
    payment: {
      currency: "USD",
      minimumPayout: 50,
      payoutSchedule: "monthly",
      stripeEnabled: true,
    },
    notification: {
      emailNotifications: true,
      pushNotifications: true,
      reminderTime: 24,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching platform settings");
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
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/settings", {
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
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-bold text-gray-800">Platform Settings</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <FaSave className="mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCog className="mr-2" /> General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) =>
                  handleChange("general", "platformName", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) =>
                  handleChange("general", "supportEmail", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) =>
                    handleChange("general", "maintenanceMode", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Maintenance Mode
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.allowRegistration}
                  onChange={(e) =>
                    handleChange(
                      "general",
                      "allowRegistration",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Allow Registration
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Session Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Session Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.session.minSessionDuration}
                onChange={(e) =>
                  handleChange(
                    "session",
                    "minSessionDuration",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Session Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.session.maxSessionDuration}
                onChange={(e) =>
                  handleChange(
                    "session",
                    "maxSessionDuration",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Cancellation Policy
              </label>
              <textarea
                value={settings.session.cancellationPolicy}
                onChange={(e) =>
                  handleChange("session", "cancellationPolicy", e.target.value)
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform Fee Percentage
              </label>
              <input
                type="number"
                value={settings.session.platformFeePercentage}
                onChange={(e) =>
                  handleChange(
                    "session",
                    "platformFeePercentage",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={settings.payment.currency}
                onChange={(e) =>
                  handleChange("payment", "currency", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Payout Amount
              </label>
              <input
                type="number"
                value={settings.payment.minimumPayout}
                onChange={(e) =>
                  handleChange(
                    "payment",
                    "minimumPayout",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payout Schedule
              </label>
              <select
                value={settings.payment.payoutSchedule}
                onChange={(e) =>
                  handleChange("payment", "payoutSchedule", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payment.stripeEnabled}
                  onChange={(e) =>
                    handleChange("payment", "stripeEnabled", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable Stripe Payments
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Notification Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notification.emailNotifications}
                  onChange={(e) =>
                    handleChange(
                      "notification",
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable Email Notifications
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notification.pushNotifications}
                  onChange={(e) =>
                    handleChange(
                      "notification",
                      "pushNotifications",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable Push Notifications
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Reminder Time (hours before)
              </label>
              <input
                type="number"
                value={settings.notification.reminderTime}
                onChange={(e) =>
                  handleChange(
                    "notification",
                    "reminderTime",
                    parseInt(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlatformSettings;
