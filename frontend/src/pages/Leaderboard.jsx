import React from 'react';

const Leaderboard = () => {
  // You’ll later fetch users and sort by trophies
  const players = [
    { name: 'Alice', trophies: 120 },
    { name: 'Bob', trophies: 95 },
    { name: 'Charlie', trophies: 80 },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <ul className="w-full max-w-md">
        {players.map((player, index) => (
          <li key={index} className="flex justify-between p-2 mb-2 bg-white rounded shadow">
            <span>{player.name}</span>
            <span>{player.trophies} 🏆</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;