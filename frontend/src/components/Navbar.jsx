import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Navbar.css";

let isLoggedIn = false; // This should be replaced with actual authentication logic

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
          <Link to={isLoggedIn ? "/leaderboard" : "/login"}>Leaderboard</Link>
        </li>
        <li>
          <Link to={isLoggedIn ? "/practice" : "/login"}>Practice</Link>
        </li>
        <li>
          <Link to={isLoggedIn ? "/profile" : "/login"}>Profile</Link>
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