import { useState } from "react";
import { UserCircle, Mail, Key, Save } from "lucide-react";
import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "I am interested in learning more about mental health and self-improvement.",
    preferences: {
      emailNotifications: true,
      sessionReminders: true,
      weeklyReport: false,
    },
  });

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [name]: checked },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "security"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "preferences"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCircle size={64} className="text-blue-600" />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <UserCircle className="text-gray-400" />
                  </div>
                  <input
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <Mail className="text-gray-400" />
                  </div>
                  <input
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="bio"
                >
                  Bio
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <Key className="text-gray-400" />
                  </div>
                  <input
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    placeholder="Your current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <Key className="text-gray-400" />
                  </div>
                  <input
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    placeholder="Your new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <Key className="text-gray-400" />
                  </div>
                  <input
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Notification Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={formData.preferences.emailNotifications}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="emailNotifications"
                    className="ml-2 block text-gray-700"
                  >
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="sessionReminders"
                    name="sessionReminders"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={formData.preferences.sessionReminders}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="sessionReminders"
                    className="ml-2 block text-gray-700"
                  >
                    Session Reminders
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="weeklyReport"
                    name="weeklyReport"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={formData.preferences.weeklyReport}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="weeklyReport"
                    className="ml-2 block text-gray-700"
                  >
                    Weekly Progress Report
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
