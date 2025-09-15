import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Redirect to login if not a logged-in user
  useEffect(() => {
    if (!token || role !== "user") {
      alert("Access denied! Please login as a user.");
      navigate("/user-login");
    }
  }, [token, role, navigate]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <Link to="profile" className="block hover:bg-gray-700 p-2 rounded">
              Profile
            </Link>
          </li>
          <li>
            <Link to="booking" className="block hover:bg-gray-700 p-2 rounded">
              Book a Session
            </Link>
          </li>
          <li>
            <Link to="history" className="block hover:bg-gray-700 p-2 rounded">
              Booking History
            </Link>
          </li>
        </ul>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/user-login");
          }}
          className="mt-6 bg-red-600 w-full p-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* The nested routes will load here */}
        <Outlet />
      </div>
    </div>
  );
}
