import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaSave, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";

const MentorProfile = () => {
  const [profile, setProfile] = useState({
    // User model fields
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
    role: "mentor",
    // Mentor model fields
    bio: "",
    expertise: [],
    availability: [],
    hourlyRate: 0,
    rating: 0,
    reviews: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchMentorProfile();
  }, []);

  const fetchMentorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      // Fetch both user and mentor data
      const [userResponse, mentorResponse] = await Promise.all([
        fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/mentors/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!userResponse.ok || !mentorResponse.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const [userData, mentorData] = await Promise.all([
        userResponse.json(),
        mentorResponse.json(),
      ]);

      setProfile({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        profileImage: userData.profileImage || "",
        role: userData.role || "mentor",
        bio: mentorData.bio || "",
        expertise: mentorData.expertise || [],
        availability: mentorData.availability || [],
        hourlyRate: mentorData.hourlyRate || 0,
        rating: mentorData.rating || 0,
        reviews: mentorData.reviews || [],
      });
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpertiseChange = (e) => {
    const expertiseArray = e.target.value.split(",").map((item) => item.trim());
    setProfile((prev) => ({
      ...prev,
      expertise: expertiseArray,
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...profile.availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    };
    setProfile((prev) => ({
      ...prev,
      availability: newAvailability,
    }));
  };

  const addAvailabilitySlot = () => {
    setProfile((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: "", time: "" }],
    }));
  };

  const removeAvailabilitySlot = (index) => {
    setProfile((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Image size should be less than 50MB");
        return;
      }
      setImageFile(file);
      setProfile((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // User data
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phoneNumber", profile.phoneNumber);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // Update user profile
      const userResponse = await fetch(
        "http://localhost:5000/api/user/profile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      // Update mentor profile
      const mentorResponse = await fetch(
        "http://localhost:5000/api/mentors/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bio: profile.bio,
            expertise: profile.expertise,
            availability: profile.availability,
            hourlyRate: parseFloat(profile.hourlyRate),
          }),
        }
      );

      if (userResponse.ok && mentorResponse.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchMentorProfile();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Mentor Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {isEditing ? (
                <>
                  <FaSave className="mr-2" />
                  Save
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  Edit
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-gray-200">
                    <span className="text-2xl font-bold text-indigo-600">
                      {getInitials(profile.firstName, profile.lastName)}
                    </span>
                  </div>
                )}

                {isEditing && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaCamera className="text-white text-2xl" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled={true}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mentor Specific Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Expertise (comma-separated)
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={profile.expertise.join(", ")}
                  onChange={handleExpertiseChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={profile.hourlyRate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <input
                  type="text"
                  value={`${profile.rating.toFixed(1)} / 5.0`}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
            </div>

            {/* Availability Section */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addAvailabilitySlot}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Slot
                  </button>
                )}
              </div>
              {profile.availability.map((slot, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <select
                    value={slot.day}
                    onChange={(e) =>
                      handleAvailabilityChange(index, "day", e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Day</option>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) =>
                      handleAvailabilityChange(index, "time", e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeAvailabilitySlot(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setImageFile(null);
                    fetchMentorProfile();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
