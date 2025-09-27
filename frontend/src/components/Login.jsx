import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Styles/Login.css";

export default function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false); // toggle login/signup

  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        navigate("/profile");
      } else {
        navigate("/leaderboard");
      }
    }
  }, [user, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }

      // create profile in localStorage if it doesn't exist
      if (!localStorage.getItem("profile")) {
        const newProfile = {
          email,
          name: email.split("@")[0],
          trophies: 0,
          wins: 0,
          losses: 0,
          winRate: "0%",
          gamesPlayed: 0,
          friends: 0,
          globalRanking: 0,
          recentMatches: [],
          languagesUsed: [],
          solvedProblems: [],
          badges: [],
        };
        localStorage.setItem("profile", JSON.stringify(newProfile));
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message);
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
          <h3>{isSignup ? "Sign Up" : "Login"}</h3>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

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
              color: "#23a2f6",
            }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>
        </form>
      </div>
    </div>
  );
}
