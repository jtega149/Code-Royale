import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import auth context
import "./Styles/Navbar.css";

const Navbar = () => {
  const { user } = useAuth(); // Get current user

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Code-Royale</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to={user ? "/leaderboard" : "/login"}>Leaderboard</Link>
        </li>
        <li>
          <Link to={user ? "/practice" : "/login"}>Practice</Link>
        </li>
        <li>
          <Link to={user ? "/profile" : "/login"}>Profile</Link>
        </li>
      </ul>
      {!user && (
        <div className="navbar-auth">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
