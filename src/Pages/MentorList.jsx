// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaSearch,
//   FaStar,
//   FaGraduationCap,
//   FaBriefcase,
//   FaFilter,
// } from "react-icons/fa";

// const MentorList = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   const categories = [
//     "all",
//     "technology",
//     "business",
//     "science",
//     "arts",
//     "engineering",
//   ];

//   const mentors = [
//     {
//       id: 1,
//       name: "Dr. Sarah Johnson",
//       title: "Senior Software Engineer",
//       company: "Google",
//       experience: "10+ years",
//       rating: 4.9,
//       reviews: 124,
//       expertise: ["Web Development", "Machine Learning", "System Design"],
//       category: "technology",
//       image: "https://randomuser.me/api/portraits/women/1.jpg",
//     },
//     {
//       id: 2,
//       name: "Prof. Michael Chen",
//       title: "Research Scientist",
//       company: "MIT",
//       experience: "15+ years",
//       rating: 4.8,
//       reviews: 98,
//       expertise: ["Physics", "Mathematics", "Research Methods"],
//       category: "science",
//       image: "https://randomuser.me/api/portraits/men/2.jpg",
//     },
//     // Add more mentors as needed
//   ];

//   const filteredMentors = mentors.filter((mentor) => {
//     const matchesSearch =
//       mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       mentor.expertise.some((skill) =>
//         skill.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     const matchesCategory =
//       selectedCategory === "all" || mentor.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Search and Filter Section */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="relative flex-1">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search mentors by name or expertise..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//           <div className="flex items-center space-x-4">
//             <FaFilter className="text-gray-400" />
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category.charAt(0).toUpperCase() + category.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Mentors Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredMentors.map((mentor, index) => (
//           <motion.div
//             key={mentor.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.1 }}
//             className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
//           >
//             <div className="p-6">
//               <div className="flex items-center space-x-4">
//                 <img
//                   src={mentor.image}
//                   alt={mentor.name}
//                   className="h-16 w-16 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     {mentor.name}
//                   </h3>
//                   <p className="text-gray-600">{mentor.title}</p>
//                 </div>
//               </div>

//               <div className="mt-4 space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <FaBriefcase className="mr-2" />
//                   <span>{mentor.company}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FaGraduationCap className="mr-2" />
//                   <span>{mentor.experience}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FaStar className="mr-2 text-yellow-400" />
//                   <span>
//                     {mentor.rating} ({mentor.reviews} reviews)
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-900 mb-2">
//                   Expertise
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {mentor.expertise.map((skill) => (
//                     <span
//                       key={skill}
//                       className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <button className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200">
//                 Schedule Session
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {filteredMentors.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-600">
//             No mentors found matching your criteria.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MentorList;
