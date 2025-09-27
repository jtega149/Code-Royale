import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Styles/Login.css"

export default function Login() {
  const { user, login } = useAuth(); // Use Firebase login
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/leaderboard");
  }, [user, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password); // Firebase login
      navigate("/leaderboard");
    } catch (err) {
      setError(err.message); // Show Firebase error messages
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          <h3>Login</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

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

          <button type="submit">Login</button>

          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              cursor: "pointer",
              color: "#23a2f6"
            }}
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? Sign Up
          </p>
        </form>
      </div>
    </div>
  );
}
