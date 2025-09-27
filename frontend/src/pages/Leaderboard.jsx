// src/pages/Leaderboard.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Styles/Leaderboard.css";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("global");

  // Example leaderboard data
  const globalPlayers = [
    { rank: 1, name: "Alice", trophies: 1200, wins: 25 },
    { rank: 2, name: "Bob", trophies: 1100, wins: 20 },
    { rank: 3, name: "Charlie", trophies: 950, wins: 18 },
    { rank: 4, name: "David", trophies: 900, wins: 15 },
  ];

  const weeklyPlayers = [
    { rank: 1, name: "Eve", trophies: 300, wins: 8 },
    { rank: 2, name: "Frank", trophies: 280, wins: 7 },
    { rank: 3, name: "Grace", trophies: 260, wins: 6 },
  ];

  const dailyPlayers = [
    { rank: 1, name: "Hannah", trophies: 50, wins: 2 },
    { rank: 2, name: "Ian", trophies: 45, wins: 2 },
    { rank: 3, name: "Jack", trophies: 40, wins: 1 },
  ];

  const getPlayers = () => {
    if (activeTab === "global") return globalPlayers;
    if (activeTab === "weekly") return weeklyPlayers;
    if (activeTab === "daily") return dailyPlayers;
    return [];
  };

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <h1>Leaderboard</h1>

        {/* Tabs */}
        <div className="leaderboard-tabs">
          <button
            className={activeTab === "global" ? "active" : ""}
            onClick={() => setActiveTab("global")}
          >
            Global
          </button>
          <button
            className={activeTab === "weekly" ? "active" : ""}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly
          </button>
          <button
            className={activeTab === "daily" ? "active" : ""}
            onClick={() => setActiveTab("daily")}
          >
            Daily
          </button>
        </div>

        {/* Table */}
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Trophies</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {getPlayers().map((player) => (
              <tr key={player.rank}>
                <td>{player.rank}</td>
                <td>{player.name}</td>
                <td>{player.trophies}</td>
                <td>{player.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;