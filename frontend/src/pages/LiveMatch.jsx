// src/pages/LiveMatch.jsx (simplified version showing queue integration)
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import MatchEditor from "../components/MatchEditor";
import Queue from "../components/Queue";
import { io } from "socket.io-client";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Styles/LiveMatch.css";

const LiveMatch = () => {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchStatus, setMatchStatus] = useState('idle'); // idle, queuing, in_match
  const [chatMessages, setChatMessages] = useState([]);
  const [opponentCode, setOpponentCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initializeSocket();
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      unsubscribe();
    };
  }, []);

  const initializeSocket = () => {
    socketRef.current = io("http://localhost:5001");

    socketRef.current.on("matchFound", (matchData) => {
      setCurrentMatch(matchData);
      setMatchStatus('in_match');
      
      // Join the match room
      socketRef.current.emit("joinMatch", matchData.matchId);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("codeUpdate", (newCode) => {
      setOpponentCode(newCode);
    });
  };

  const handleMatchFound = (matchData) => {
    setCurrentMatch(matchData);
    setMatchStatus('in_match');
  };

  const handleCancelQueue = () => {
    setMatchStatus('idle');
  };

  if (matchStatus === 'idle' || matchStatus === 'queuing') {
    return (
      <>
        <Navbar />
        <div className="matchmaking-container">
          <h2>Find a Coding Match</h2>
          <Queue 
            socket={socketRef.current}
            onMatchFound={handleMatchFound}
            onCancel={handleCancelQueue}
          />
        </div>
      </>
    );
  }

  // Rest of your existing LiveMatch component for when in match
  return (
    <>
      <Navbar />
      <div className="livematch-container">
        {/* Your existing match UI */}
        <h3>Match against: {currentMatch?.opponent}</h3>
        {/* ... rest of your component */}
      </div>
    </>
  );
};

export default LiveMatch;