// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login, logout } = useAuth(); // now works
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // fake login logic (replace with real API call later)
    const fakeUser = { email };
    login(fakeUser);

    // go to leaderboard after login
    navigate("/leaderboard");
  };

  return (
    <div className="login-page">
      <h1>{user ? `Welcome ${user.email}` : "Login"}</h1>

      {!user ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <p>You are logged in.</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
