import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ Protect the admin page
  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Access denied! Admins only.");
      navigate("/admin-login");
    }
  }, [role, token, navigate]);

  // ✅ Fetch Helper with Token
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    return res;
  };

  // ✅ Fetch All Bookings
  const fetchBookings = async () => {
    const res = await authFetch("http://localhost:5000/api/bookings");
    if (!res) return;
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Update Booking Status (Accept / Decline)
  const updateBookingStatus = async (id, newStatus) => {
    try {
      if (!window.confirm(`Are you sure you want to mark as ${newStatus}?`)) return;

      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchBookings(); // Refresh table after update
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Something went wrong while updating status");
    }
  };

  // ✅ Filter Bookings by Search and Status
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (b.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/admin-login");
            }}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-4 mb-4">
          {["All", "Pending", "Accepted", "Declined"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg border ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{b.name}</td>
                    <td className="px-4 py-2 border">{b.email}</td>
                    <td className="px-4 py-2 border">{b.phone}</td>
                    <td className="px-4 py-2 border">{b.date}</td>
                    <td
                      className={`px-4 py-2 border font-semibold ${
                        b.status === "Pending"
                          ? "text-yellow-600"
                          : b.status === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {b.status}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => updateBookingStatus(b._id, "Accepted")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        disabled={b.status === "Accepted"}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b._id, "Declined")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        disabled={b.status === "Declined"}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
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
