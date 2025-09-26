import React from "react";
<<<<<<< Updated upstream
import Navbar from "../components/Navbar";
import "./Home.css";
=======
import "./Home.css";
import background from "../Photos/HP_bkg.png"; // correct relative path
>>>>>>> Stashed changes

export default function Home() {
  return (
<<<<<<< Updated upstream
    <div className="home-container">
      <Navbar /> {/* Navbar only appears here */}
      <div className="home-content">
        <h1>Welcome to Code-Royale!</h1>
        <p>Compete with other coders in real-time and climb the leaderboard.</p>
        <div className="home-buttons">
          <button className="start-match-btn">Start a Match</button>
          <button className="practice-btn">Practice Problems</button>
=======
    <div
      className="homepage"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="overlay" />

      {/* Main content */}
      <div className="content">
        <h1 className="game-title">Code Royale</h1>
        <p className="tagline">Embark on an epic adventure!</p>

        <div className="buttons">
          <button className="btn play">Play Now</button>
          <button className="btn about">About</button>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
<<<<<<< Updated upstream
};

export default Home;
=======
}
>>>>>>> Stashed changes
