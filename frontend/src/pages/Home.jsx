import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Code-Royale</h1>
      <p className="mb-6 text-center max-w-md">
        Compete in real-time coding matches against other players and climb the leaderboard!
      </p>
      <div className="space-x-4">
        <Link to="/queue" className="px-4 py-2 bg-blue-500 text-white rounded">Find a Match</Link>
        <Link to="/leaderboard" className="px-4 py-2 bg-green-500 text-white rounded">Leaderboard</Link>
      </div>
    </div>
  );
};

export default Home;