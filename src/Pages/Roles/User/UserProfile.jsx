import { useState, useEffect } from "react";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaCamera,
  FaCrop,
  FaTimes,
} from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
    imageCrop: null, // Store crop data
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    aspect: 1,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching profile");
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

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
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
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop) => {
    setProfile((prev) => ({
      ...prev,
      imageCrop: crop,
    }));
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    if (!profile.imageCrop) {
      // If no previous crop exists, reset the image
      setImageFile(null);
      setProfile((prev) => ({
        ...prev,
        profileImage: prev.originalImage || "",
      }));
    }
  };

  const handleCropSave = () => {
    setShowCropModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phoneNumber", profile.phoneNumber);
      if (imageFile) {
        formData.append("profileImage", imageFile);
        formData.append("imageCrop", JSON.stringify(profile.imageCrop));
      }

      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchUserProfile();
      } else {
        throw new Error("Failed to update profile");
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
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
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {profile.profileImage ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      style={
                        profile.imageCrop
                          ? {
                              transform: `scale(${
                                100 / profile.imageCrop.width
                              })`,
                              marginLeft: `-${profile.imageCrop.x}%`,
                              marginTop: `-${profile.imageCrop.y}%`,
                            }
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl text-gray-600">
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
                      aria-label="Change profile picture"
                    />
                  </>
                )}
              </div>
            </div>

            {imageFile && isEditing && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setProfile((prev) => ({
                      ...prev,
                      profileImage: profile.profileImage || "",
                    }));
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove selected image
                </button>
              </div>
            )}

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

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setImageFile(null);
                    fetchUserProfile(); // Reset to original data
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

      {/* Crop Modal - Compact Version */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Adjust Profile Picture
              </h3>
              <button
                onClick={handleCropCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* Crop Area */}
            <div className="p-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                  aspect={1}
                  className="max-h-[400px] mx-auto"
                  circularCrop
                >
                  <img
                    src={profile.profileImage}
                    alt="Crop preview"
                    className="max-w-full"
                    style={{
                      maxHeight: "400px",
                      width: "auto",
                      margin: "0 auto",
                    }}
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex justify-end gap-2">
              <button
                onClick={handleCropCancel}
                className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
