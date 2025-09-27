import React from "react";
import Navbar from "../components/Navbar";
import { FaGlobe, FaUserFriends, FaBook, FaSearch, FaLayerGroup, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Match.css";

const Match = () => {
  const navigate = useNavigate();

  const matchOptions = [
    { title: "Play Online", icon: <FaGlobe />, description: "Compete with random players online." },
    { title: "Play a Friend", icon: <FaUserFriends />, description: "Challenge your friends directly." },
    { title: "Practice Mode", icon: <FaBook />, description: "Solve problems without pressure." },
    { title: "Play Specific Problem", icon: <FaSearch />, description: "Pick a problem to compete on." },
    { title: "Play Specific Topic", icon: <FaLayerGroup />, description: "Focus on a particular topic." },
    { title: "View Leaderboard", icon: <FaTrophy />, description: "Check top players worldwide." },
  ];

  const handleSelect = (title) => {
    if (title === "Play a Friend") {
      navigate("/friend-play");
    }
    // Add other navigation logic if needed in the future
  };

  return (
    <>
      <Navbar />
      <div className="match-container">
        <h1>Start a Code Royale Match</h1>
        <div className="match-grid">
          {matchOptions.map((option, index) => (
            <div key={index} className="match-card">
              <div className="icon">{option.icon}</div>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <button
                className="play-button"
                onClick={() => handleSelect(option.title)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Match;
