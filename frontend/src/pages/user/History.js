import React, { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // ✅ Check if user is logged in and is a "user"
    if (!token || role !== "user") {
      setError("Access denied. Please log in as a user to view your history.");
      setLoading(false);
      return;
    }

    // Fetch booking history
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booking history.");
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("There was an issue loading your booking history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">My Booking History</h1>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500">Loading your bookings...</p>}

      {/* Error State */}
      {error && !loading && <p className="text-center text-red-500">{error}</p>}

      {/* Booking List */}
      {!loading && !error && (
        <>
          {history.length === 0 ? (
            <p className="text-center text-gray-600">No past bookings found.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((booking) => (
                <li
                  key={booking._id}
                  className="p-4 border rounded bg-white shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.message || "No additional message provided."}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded text-white text-sm ${
                          booking.status === "approved"
                            ? "bg-green-500"
                            : booking.status === "declined"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
