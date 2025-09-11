import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex gap-6">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/gallery" className="hover:text-gray-300">Gallery</Link></li>
            <li><Link to="/booking" className="hover:text-gray-300">Booking</Link></li>
            <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
            <li><Link to="/admin" className="hover:text-gray-300">Admin</Link></li>
          </ul>
        </nav>

        {/* Page Routes */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
