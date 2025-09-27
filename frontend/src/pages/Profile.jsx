import React from 'react';
import Navbar from '../components/Navbar';
import "./Styles/Profile.css";


function getRankIcon(xp) {
  if (xp >= 100) return "/First place trophy V1.png";
  if (xp >= 50) return "/Second place trophy V2.png";
  return "/Third place trophy V1.png";
}

const Profile = () => {
  const username = "Jane Doe"; 
  const xp = 100;

  const rankIcon = getRankIcon(xp);

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Profile header */}
        <div className="profile-header">
          <img src="/pfp1.png" alt="Profile" className="profile-pic" />
         
          {/*Name and Rank*/}
          <div className="name-rank">
          <h1>{username}</h1>
          <img src={rankIcon} alt="Rank" className="rank-icon" />
          </div>
          <button className="edit-profile-button">Edit Profile</button>
        </div>


        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Trophies</h3>
            <p>123</p>
          </div>
          <div className="stat-card">
            <h3>Wins</h3>
            <p>45</p>
          </div>
          <div className="stat-card">
            <h3>Losses</h3>
            <p>67</p>
          </div>
          <div className="stat-card">
            <h3>Win Rate</h3>
            <p>40%</p>
          </div>
          <div className="stat-card">
            <h3>Games Played</h3>
            <p>112</p>
          </div>
          <div className="stat-card">
            <h3>Friends</h3>
            <p>8</p>
          </div>
          <div className="stat-card">
            <h3>Global Ranking</h3>
            <p>1</p>
          </div>
        </div>

        {/* Recent Matches */}
        <h2 className="section-title">Recent Matches</h2>
        <div className="recent-matches">
          <div className="match-card win">
            <h3>Match vs Alice</h3>
            <p>Result: Win</p>
            <p>Date: 2024-10-01</p>
          </div>
          <div className="match-card loss">
            <h3>Match vs Bob</h3>
            <p>Result: Loss</p>
            <p>Date: 2024-09-28</p>
          </div>
          <div className="match-card win">
            <h3>Match vs Charlie</h3>
            <p>Result: Win</p>
            <p>Date: 2024-09-25</p>
          </div>
        </div>

        {/* Languages Used */}
        <div className="languages-used">
          <h2 className="section-title">Languages Used</h2>
          <ul>
            <li>JavaScript - 4 problems</li>
            <li>Python - 32 problems</li>
            <li>C++ - 2 problems</li>
          </ul>
        </div>

        {/* Solved Problems */}
        <div className="solved-problems">
          <h2 className="section-title">Solved Problems</h2>
          <ul>
            <li>Two Sum</li>
            <li>Reverse Linked List</li>
            <li>Valid Parentheses</li>
            <li>Merge Intervals</li>
          </ul>
        </div>

        {/* Badges */}
        <div className="badges">
          <h2 className="section-title">Badges</h2>
          <p>No badges earned yet. Keep coding to earn badges!</p>
        </div>

        {/* Friends List */}
        <div className="friends-list">
          <h2 className="section-title">Friends List</h2>
          <ul>
            <li>Alice</li>
            <li>Bob</li>
            <li>Charlie</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Profile;
