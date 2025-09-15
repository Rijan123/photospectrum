import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Profile updated successfully!");
      setProfile(res.data.user);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 text-gray-600">{profile.name}</p>
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., +1 234 567 890"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your address"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
