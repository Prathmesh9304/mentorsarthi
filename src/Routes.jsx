import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar";
import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";

import Profile from "./Pages/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";

// Admin Pages
import AdminDashboard from "./Pages/Roles/Admin/AdminDashboard";
import ManageUsers from "./Pages/Roles/Admin/ManageUsers";
import ManageMentors from "./Pages/Roles/Admin/ManageMentors";
import SessionsManagement from "./Pages/Roles/Admin/SessionsManagement";
import Reports from "./Pages/Roles/Admin/Reports";
import Earnings from "./Pages/Roles/Admin/Earnings";
import PlatformSettings from "./Pages/Roles/Admin/PlatformSettings";

// Mentor Pages
import MentorDashboard from "./Pages/Roles/Mentor/MentorDashboard";
import MySessions from "./Pages/Roles/Mentor/MySessions";
import SessionsRequests from "./Pages/Roles/Mentor/SessionsRequests";
import MentorMessages from "./Pages/Roles/Mentor/MentorMessages";
import MentorProfile from "./Pages/Roles/Mentor/MentorProfile";
import MentorSettings from "./Pages/Roles/Mentor/MentorSettings";
import ResourcesAndGuidelines from "./Pages/Roles/Mentor/ResourcesAndGuidelines";

// User Pages
import UserDashboard from "./Pages/Roles/User/UserDashboard";
import FindAMentor from "./Pages/Roles/User/FindAMentor";
import MySessionsUser from "./Pages/Roles/User/MySessionsUser";
import MyRequests from "./Pages/Roles/User/MyRequests";
import UserMessages from "./Pages/Roles/User/UserMessages";
import UserProfile from "./Pages/Roles/User/UserProfile";
import UserSettings from "./Pages/Roles/User/UserSettings";
import FeedbackAndReviews from "./Pages/Roles/User/FeedbackAndReviews";

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-mentor"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <FindAMentor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/sessions"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MySessionsUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/requests"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/messages"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/settings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/feedback"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <FeedbackAndReviews />
            </ProtectedRoute>
          }
        />

        {/* Mentor Routes */}
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/sessions"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MySessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/requests"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <SessionsRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/messages"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/profile"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/settings"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/resources"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <ResourcesAndGuidelines />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-mentors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageMentors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SessionsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/earnings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Earnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/platform-settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PlatformSettings />
            </ProtectedRoute>
          }
        />

        {/* Common Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "mentor", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
