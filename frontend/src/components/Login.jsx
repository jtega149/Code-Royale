// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();

    const fakeUser = { email };
    login(fakeUser);

    navigate("/leaderboard");
  };

  return (
    <div className="login-page">
      {/* ✅ Navbar stays fixed at top */}
      <Navbar />

      {/* Background wrapper for login area */}
      <div className="login-container">
        <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        {user ? (
          <div className="login-form">
            <h3>Welcome {user.email}</h3>
            <p>You now have full access 🚀</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="login-form">
            <h3>{isSignup ? "Sign Up" : "Login"}</h3>

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>

            <p
              style={{
                marginTop: "20px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don’t have an account? Sign Up"}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
