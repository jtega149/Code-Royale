import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Navbar.css";

const Navbar = () => {
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
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link to="/practice">Practice</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className="navbar-auth">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;