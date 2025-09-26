import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your pages/components
import Home from './pages/Home.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Simple Top Navigation */}
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
          <div className="font-bold text-xl">Code-Royale</div>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        {/* Optional Footer */}
        <footer className="bg-gray-800 text-white text-center p-4">
          &copy; 2025 Code-Royale
        </footer>
      </div>
    </Router>
  );
};

export default App;