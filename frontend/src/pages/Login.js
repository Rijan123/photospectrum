import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // If response is not OK
      if (!res.ok) {
        const errorData = await res.json();
        return alert(errorData.message || "Invalid credentials");
      }

      const data = await res.json();

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      alert("Login successful!");

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // or user-specific dashboard
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto mt-10 space-y-3 p-4 border rounded-lg shadow-md bg-white"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      <input
        className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
