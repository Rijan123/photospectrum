import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";

// ✅ User nested pages
import Booking from "./pages/user/Booking";
import Profile from "./pages/user/Profile";
import History from "./pages/user/History";

function App() {
  return (
    <Router>
      <div>
        {/* Top Navigation */}
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex gap-6">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/gallery" className="hover:text-gray-300">Gallery</Link></li>
            <li><Link to="/user-login" className="hover:text-gray-300">User Login</Link></li>
            <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
            <li><Link to="/admin-login" className="hover:text-gray-300">Admin Login</Link></li>
            <li><Link to="/admin" className="hover:text-gray-300">Admin</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <div className="p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* User Dashboard with Nested Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Booking />} />
              <Route path="booking" element={<Booking />} />
              <Route path="profile" element={<Profile />} />
              <Route path="history" element={<History />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
