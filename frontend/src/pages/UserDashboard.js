import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || role !== "user") {
      alert("Access denied! Users only.");
      navigate("/user-login");
    }
  }, [token, role, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">User Panel</h2>
        <ul className="space-y-3">
          <li>
            <Link to="booking" className="block hover:bg-gray-700 p-2 rounded">
              Booking
            </Link>
          </li>
          <li>
            <Link to="profile" className="block hover:bg-gray-700 p-2 rounded">
              Profile
            </Link>
          </li>
          <li>
            <Link to="history" className="block hover:bg-gray-700 p-2 rounded">
              History
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

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
