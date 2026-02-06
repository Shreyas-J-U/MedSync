// src/components/common/Navbar.jsx
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg"; // Make sure this exists and is not too dark

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white bg-opacity-80 backdrop-blur-md shadow-sm">
      <Link to="/" className="flex items-center space-x-3">
        <img src={logo} alt="MedSync Logo" className="w-9 h-9 rounded-full object-cover" />
        <span className="text-2xl font-bold text-blue-800">MedSync</span>
      </Link>

      <div className="space-x-6 text-blue-700 font-medium">
        <Link to="/login" className="hover:text-blue-900 transition">Login</Link>
        <Link to="/register" className="hover:text-blue-900 transition">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
