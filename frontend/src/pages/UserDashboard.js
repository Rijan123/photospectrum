import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // ✅ Protect the dashboard so only logged-in users can access
  useEffect(() => {
    if (!token || role !== "user") {
      alert("Access denied! Please login as a user.");
      navigate("/user-login");
    } else {
      fetchProfile();
    }
  }, [token, role, navigate]);

  // Fetch logged-in user's profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  // Highlight active link
  const isActive = (path) =>
    location.pathname.includes(path) ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col">
        {/* Profile Section */}
        <div className="p-6 text-center border-b border-gray-700">
          <div className="flex flex-col items-center">
            <img
              src={
                profile?.profileImage
                  ? `http://localhost:5000/uploads/${profile.profileImage}`
                  : "https://via.placeholder.com/80"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-gray-600 object-cover"
            />
            <h2 className="mt-3 text-lg font-semibold">{profile?.name || "User"}</h2>
            <p className="text-gray-400 text-sm">{profile?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="profile"
            className={`flex items-center gap-3 px-3 py-2 rounded transition ${isActive("profile")}`}
          >
            <UserCircleIcon className="h-5 w-5" />
            Profile
          </Link>

          <Link
            to="booking"
            className={`flex items-center gap-3 px-3 py-2 rounded transition ${isActive("booking")}`}
          >
            <CalendarDaysIcon className="h-5 w-5" />
            Book a Session
          </Link>

          <Link
            to="history"
            className={`flex items-center gap-3 px-3 py-2 rounded transition ${isActive("history")}`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            Booking History
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/user-login");
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
