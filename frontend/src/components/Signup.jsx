import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Styles/Signup.css";

const Signup = () => {
  const { user, signup } = useAuth(); // Use Firebase signup
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/leaderboard");
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirm) {
      setError("Please fill out all fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(email, password); // Firebase signup
      navigate("/leaderboard"); // Redirect on success
    } catch (err) {
      setError(err.message); // Show Firebase errors (email in use, weak password, etc.)
    }
  };

  return (
    <div className="signup-container">
      <Navbar />
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form className="signup-form" onSubmit={handleSignup}>
        <h3>Sign Up</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
