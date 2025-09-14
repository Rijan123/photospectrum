import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ✅ Check role

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />; // redirect non-admins to home
  }

  return children;
}
