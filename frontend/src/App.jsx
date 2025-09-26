import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import "./App.css"; // Create this file if it doesn't exist
import Profile from "./pages/Profile";
import Practice from "./pages/Practice";
import Match from "./pages/Match";

function App() {
  return (
    <Router>
      <div className="app-container"> {/* Add this wrapper */}
        <Routes>
          {/* Public pages (no navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Main app pages (can include navbar later) */}
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/match" element={<Match />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;