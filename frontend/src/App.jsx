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
import { initializeApp } from "firebase/app";
import ReactDOM from "react-dom";
import { AuthProvider } from "./context/AuthContext";
import { getAnalytics } from "firebase/analytics";
import { useState } from 'react'

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';import Friend_play from "./pages/Friend_play"; // <--- added
import "./App.css";

function App() {

  console.log(import.meta.env.VITE_apiKey)

  return (
    //<AuthProvider>
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
          <Route path="/match/livematch" element={<LiveMatch />} /> {/* <-- new route */}
          <Route path="/friend-play" element={<Friend_play />} /> {/* <--- added */}
        </Routes>
      </div>
    </Router>
   // </AuthProvider>
  );
}

export default App;
