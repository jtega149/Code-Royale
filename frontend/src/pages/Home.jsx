import React from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import "./Home.css";
import background from "../Photos/HP_bkg.png";

export default function Home() {
  const navigate = useNavigate();

  const goToMatch = () => {
    navigate("/match");
  };

  const goToPractice = () => {
    navigate("/practice");
  };

  return (
    <div className="homepage">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <div className="overlay" />
        <div className="hero-content">
          <h1 className="game-title">Code Royale</h1>
          <p className="tagline">
            Compete with other coders in real-time and climb the leaderboard.
          </p>
          <div className="buttons">
            <button className="btn play" onClick={goToMatch}>
              Start a Match
            </button>
            <button className="btn about" onClick={goToPractice}>
              Practice Problems
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3>Real-time Matches</h3>
            <p>Challenge others in live coding competitions.</p>
          </div>
          <div className="feature-card">
            <h3>Practice Problems</h3>
            <p>Improve your skills with curated coding challenges.</p>
          </div>
          <div className="feature-card">
            <h3>Leaderboard</h3>
            <p>Track your progress and climb the rankings.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About Code Royale</h2>
        <p>
          Code Royale is a platform for coders to compete, learn, and grow.
          Build your skills, meet like-minded developers, and enjoy a fun coding environment.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Code Royale. All rights reserved.</p>
      </footer>
    </div>
  );
}
