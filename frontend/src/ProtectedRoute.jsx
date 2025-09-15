import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ If no token, redirect to login page
  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  // ✅ If role doesn't match required role, block access
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
