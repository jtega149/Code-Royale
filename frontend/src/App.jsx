// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Practice from "./pages/Practice";
import Match from "./pages/Match";
import LiveMatch from "./pages/LiveMatch";
import Friend_play from "./pages/Friend_play"; 
import { AuthProvider } from "./context/AuthContext"; // ✅ wrap app with this
import "./App.css";
import PlayProblem from "./pages/PlayProblem";

function App() {
  console.log(import.meta.env.VITE_apiKey);

  return (
    <AuthProvider> {/* ✅ make AuthContext available everywhere */}
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/match" element={<Match />} />
            <Route path="/match/livematch" element={<LiveMatch />} />
            <Route path="/friend-play" element={<Friend_play />} />
            <Route path="/play-problem" element={<PlayProblem />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
