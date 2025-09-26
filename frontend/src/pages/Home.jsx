import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import background from "../Photos/HP_bkg.png";

export default function Home() {
  return (
    <div
      className="homepage"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar className="fixed-navbar" />

      {/* Overlay */}
      <div className="overlay" />

      {/* Main content */}
      <div className="content">
        <h1 className="game-title">Code Royale</h1>
        <p className="tagline">
          Compete with other coders in real-time and climb the leaderboard.
        </p>

        <div className="buttons">
          <button className="btn play">Start a Match</button>
          <button className="btn about">Practice Problems</button>
        </div>
      </div>
    </div>
  );
}
