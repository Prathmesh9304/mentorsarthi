import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaUser,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaChartBar,
  FaDollarSign,
  FaCog,
  FaSearch,
  FaComments,
  FaBook,
  FaClipboardList,
  FaStar,
  FaGraduationCap,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.firstName) return "?";
    return `${user.firstName.charAt(0)}${
      user.lastName ? user.lastName.charAt(0) : ""
    }`;
  };

  // Role-specific navigation links
  const getNavigationLinks = () => {
    if (!isAuthenticated) return [];

    switch (user?.role) {
      case "admin":
        return [
          { to: "/admin/dashboard", icon: <FaChartBar />, text: "Dashboard" },
          {
            to: "/admin/manage-users",
            icon: <FaUsers />,
            text: "Manage Users",
          },
          {
            to: "/admin/manage-mentors",
            icon: <FaChalkboardTeacher />,
            text: "Manage Mentors",
          },
          {
            to: "/admin/sessions",
            icon: <FaCalendarCheck />,
            text: "Sessions Management",
          },
          {
            to: "/admin/reports",
            icon: <FaClipboardList />,
            text: "Reports & Feedback",
          },
          {
            to: "/admin/earnings",
            icon: <FaDollarSign />,
            text: "Earnings & Transactions",
          },
          { to: "/admin/settings", icon: <FaCog />, text: "Platform Settings" },
        ];
      case "mentor":
        return [
          { to: "/mentor/dashboard", icon: <FaChartBar />, text: "Dashboard" },
          {
            to: "/mentor/sessions",
            icon: <FaCalendarCheck />,
            text: "My Sessions",
          },
          {
            to: "/mentor/requests",
            icon: <FaClipboardList />,
            text: "Session Requests",
          },
          { to: "/mentor/messages", icon: <FaComments />, text: "Messages" },
          { to: "/mentor/resources", icon: <FaBook />, text: "Resources" },
        ];
      case "user":
        return [
          { to: "/user/dashboard", icon: <FaChartBar />, text: "Dashboard" },
          { to: "/find-mentor", icon: <FaSearch />, text: "Find a Mentor" },
          {
            to: "/user/sessions",
            icon: <FaCalendarCheck />,
            text: "My Sessions",
          },
          {
            to: "/user/requests",
            icon: <FaClipboardList />,
            text: "My Requests",
          },
          { to: "/user/messages", icon: <FaComments />, text: "Messages" },
          { to: "/user/feedback", icon: <FaStar />, text: "Feedback" },
        ];
      default:
        return [];
    }
  };

  // Profile dropdown menu items
  const getProfileMenuItems = () => {
    const baseItems = [
      {
        to: `/${user?.role}/profile`,
        text: "Profile",
        icon: <FaUser />,
      },
      {
        to: `/${user?.role}/settings`,
        text: "Settings",
        icon: <FaCog />,
      },
    ];

    if (user?.role === "admin") {
      baseItems.push({
        to: "/admin/platform-settings",
        text: "Platform Settings",
        icon: <FaCog />,
      });
    }

    baseItems.push({ onClick: handleLogout, text: "Logout", icon: <FiX /> });
    return baseItems;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <FaGraduationCap className="text-indigo-600 text-3xl" />
              <span className="font-bold text-xl text-gray-800">
                MentorSarthi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {getNavigationLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                ))}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      {getInitials()}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        {getProfileMenuItems().map((item, index) =>
                          item.to ? (
                            <Link
                              key={index}
                              to={item.to}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.icon}
                              <span>{item.text}</span>
                            </Link>
                          ) : (
                            <button
                              key={index}
                              onClick={item.onClick}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.icon}
                              <span>{item.text}</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                {getNavigationLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                ))}
                {getProfileMenuItems().map((item, index) =>
                  item.to ? (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </button>
                  )
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
