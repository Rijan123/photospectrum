import { useEffect, useState } from "react";

export default function Admin() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Time</th>
            <th className="px-4 py-2 border">Message</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{booking.name}</td>
              <td className="px-4 py-2 border">{booking.email}</td>
              <td className="px-4 py-2 border">{booking.phone}</td>
              <td className="px-4 py-2 border">{booking.date}</td>
              <td className="px-4 py-2 border">{booking.time}</td>
              <td className="px-4 py-2 border">{booking.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
