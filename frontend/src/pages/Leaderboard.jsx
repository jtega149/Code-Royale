import React from "react";
import Navbar from "../components/Navbar";
import "./Leaderboard.css";

const Leaderboard = () => {
  // Example leaderboard data
  const players = [
    { rank: 1, name: "Alice", trophies: 1200, wins: 25 },
    { rank: 2, name: "Bob", trophies: 1100, wins: 20 },
    { rank: 3, name: "Charlie", trophies: 950, wins: 18 },
    { rank: 4, name: "David", trophies: 900, wins: 15 },
  ];

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <h1>Leaderboard</h1>
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
            {players.map((player) => (
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