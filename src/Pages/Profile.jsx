// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// const Profile = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [profileData, setProfileData] = useState({
//     firstName: user?.firstName || "",
//     lastName: user?.lastName || "",
//     email: user?.email || "",
//     bio: user?.bio || "",
//     location: user?.location || "",
//     phoneNumber: user?.phoneNumber || "",
//     socialLinks: {
//       linkedin: user?.socialLinks?.linkedin || "",
//       github: user?.socialLinks?.github || "",
//       twitter: user?.socialLinks?.twitter || "",
//     },
//   });

//   const [isEditing, setIsEditing] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setProfileData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }));
//     } else {
//       setProfileData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/users/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(profileData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update profile");
//       }

//       const updatedUser = await response.json();
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       setIsEditing(false);
//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       toast.error(error.message || "Error updating profile");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className="text-indigo-600 hover:text-indigo-800"
//           >
//             {isEditing ? "Cancel" : "Edit Profile"}
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={profileData.firstName}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={profileData.lastName}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={profileData.email}
//               disabled
//               className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Bio
//             </label>
//             <textarea
//               name="bio"
//               value={profileData.bio}
//               onChange={handleChange}
//               disabled={!isEditing}
//               rows={4}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Location
//             </label>
//             <input
//               type="text"
//               name="location"
//               value={profileData.location}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={profileData.phoneNumber}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             />
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 LinkedIn
//               </label>
//               <input
//                 type="url"
//                 name="socialLinks.linkedin"
//                 value={profileData.socialLinks.linkedin}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 GitHub
//               </label>
//               <input
//                 type="url"
//                 name="socialLinks.github"
//                 value={profileData.socialLinks.github}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Twitter
//               </label>
//               <input
//                 type="url"
//                 name="socialLinks.twitter"
//                 value={profileData.socialLinks.twitter}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           {isEditing && (
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Save Changes
//               </button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;
