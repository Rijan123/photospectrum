import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return alert("Invalid credentials");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/admin");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-10 space-y-3">
      <input className="border w-full p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border w-full p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-black text-white px-4 py-2 rounded" type="submit">Login</button>
    </form>
  );
}
