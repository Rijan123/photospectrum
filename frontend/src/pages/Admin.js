import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Helper fetch function with auth
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    // Handle unauthorized or expired token
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
    console.log("Bookings fetched:", data); // Debugging log
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
      fetchBookings(); // Refresh the table
    } else {
      alert("Failed to delete booking");
    }
  };

  // Load bookings when page loads
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login"); // redirect properly
          }}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Message</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{booking.name}</td>
                  <td className="px-4 py-2 border">{booking.email}</td>
                  <td className="px-4 py-2 border">{booking.phone}</td>
                  <td className="px-4 py-2 border">{booking.date}</td>
                  <td className="px-4 py-2 border">{booking.time}</td>
                  <td className="px-4 py-2 border">{booking.message}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
