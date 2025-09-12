import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search filter state
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Helper fetch function with token auth
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    // Handle expired or invalid token
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
      return null;
    }

    return res;
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    const res = await authFetch("http://localhost:5000/api/bookings");
    if (!res) return;
    const data = await res.json();
    setBookings(data);
  };

  // Delete a booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    const res = await authFetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "DELETE",
    });
    if (!res) return;

    if (res.ok) {
      alert("Booking deleted successfully!");
      fetchBookings(); // Refresh table
    } else {
      alert("Failed to delete booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings by name or email
  const filteredBookings = bookings.filter(
    (b) =>
      (b.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (b.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="mt-4 sm:mt-0 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold">Total Bookings</h2>
            <p className="text-3xl font-bold mt-2">{bookings.length}</p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold">Today's Bookings</h2>
            <p className="text-3xl font-bold mt-2">
              {
                bookings.filter(
                  (b) =>
                    new Date(b.date).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
            <p className="text-3xl font-bold mt-2">
              {bookings.filter((b) => new Date(b.date) > new Date()).length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0"
          />
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2 border">{b.name}</td>
                    <td className="px-4 py-2 border">{b.email}</td>
                    <td className="px-4 py-2 border">{b.phone}</td>
                    <td className="px-4 py-2 border">{b.date}</td>
                    <td className="px-4 py-2 border">{b.time}</td>
                    <td className="px-4 py-2 border">{b.message}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-4 text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
