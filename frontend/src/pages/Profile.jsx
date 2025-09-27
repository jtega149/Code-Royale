import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Styles/Profile.css";


function getRankIcon(xp) {
  if (xp >= 100) return "/First place trophy V1.png";
  if (xp >= 50) return "/Second place trophy V2.png";
  return "/Third place trophy V1.png";
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const storedProfile = localStorage.getItem("profile");

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      const newProfile = {
        email: user.email || "",
        name: "User",
        trophies: 0,
        wins: 0,
        losses: 0,
        winRate: "0%",
        gamesPlayed: 0,
        friends: 0,
        globalRanking: 0,
        recentMatches: [],
        languagesUsed: [],
        solvedProblems: [],
        badges: [],
      };
      localStorage.setItem("profile", JSON.stringify(newProfile));
      setProfile(newProfile);
    }

    setLoading(false);
  }, [user]);

  const updateProfile = (newData) => {
    const updatedProfile = { ...profile, ...newData };
    setProfile(updatedProfile);
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-container" style={{ textAlign: "center", padding: "50px" }}>
          <h2>Please log in or create an account to view your profile.</h2>
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </>
    );
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</p>;

  const username = "Jane Doe"; 
  const xp = 100;

  const rankIcon = getRankIcon(xp);

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <img src="/pfp1.png" alt="Profile" className="profile-pic" />
          <h1>{profile.name}</h1>
          <button
            className="edit-profile-button"
            onClick={() => {
              const newName = prompt("Enter your new username:", profile.name);
              if (newName) updateProfile({ name: newName });
            }}
          >
            Edit Profile
          </button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
         
          {/*Name and Rank*/}
          <div className="name-rank">
          <h1>{username}</h1>
          <img src={rankIcon} alt="Rank" className="rank-icon" />
          </div>
          <button className="edit-profile-button">Edit Profile</button>
        </div>



        <div className="profile-stats">
          {["Trophies", "Wins", "Losses", "Win Rate", "Games Played", "Friends", "Global Ranking"].map(
            (stat, idx) => (
              <div className="stat-card" key={idx}>
                <h3>{stat}</h3>
                <p>{profile[stat.replace(/ /g, "").toLowerCase()] || 0}</p>
              </div>
            )
          )}
        </div>

        <h2 className="section-title">Recent Matches</h2>
        {profile.recentMatches.length === 0 ? (
          <p>No recent matches played yet.</p>
        ) : (
          <div className="recent-matches">
            {profile.recentMatches.map((match, idx) => (
              <div key={idx} className={`match-card ${match.result.toLowerCase()}`}>
                <h3>Match vs {match.opponent}</h3>
                <p>Result: {match.result}</p>
                <p>Date: {match.date}</p>
              </div>
            ))}
          </div>
        )}

        <div className="languages-used">
          <h2 className="section-title">Languages Used</h2>
          {profile.languagesUsed.length === 0 ? (
            <p>No languages used yet.</p>
          ) : (
            <ul>{profile.languagesUsed.map((lang, idx) => <li key={idx}>{lang}</li>)}</ul>
          )}
        </div>

        <div className="solved-problems">
          <h2 className="section-title">Solved Problems</h2>
          {profile.solvedProblems.length === 0 ? (
            <p>No problems solved yet.</p>
          ) : (
            <ul>{profile.solvedProblems.map((prob, idx) => <li key={idx}>{prob}</li>)}</ul>
          )}
        </div>

        <div className="badges">
          <h2 className="section-title">Badges</h2>
          {profile.badges.length === 0 ? (
            <p>No badges earned yet. Keep coding to earn badges!</p>
          ) : (
            <ul>{profile.badges.map((badge, idx) => <li key={idx}>{badge}</li>)}</ul>
          )}
        </div>

        <div className="friends-list">
          <h2 className="section-title">Friends List</h2>
          {profile.friends === 0 ? <p>No friends yet.</p> : <ul>{/* List friends here */}</ul>}
        </div>
      </div>
    </>
  );
};

export default Profile;
