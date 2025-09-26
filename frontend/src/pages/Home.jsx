import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar /> {/* Navbar only appears here */}
      <div className="home-content">
        <h1>Welcome to Code-Royale!</h1>
        <p>Compete with other coders in real-time and climb the leaderboard.</p>
        <div className="home-buttons">
          <button className="start-match-btn">Start a Match</button>
          <button className="practice-btn">Practice Problems</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
