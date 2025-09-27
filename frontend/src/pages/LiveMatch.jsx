// src/pages/LiveMatch.jsx
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
  const [matchStatus, setMatchStatus] = useState("idle"); // idle, queuing, in_match
  const [chatMessages, setChatMessages] = useState([]);
  const [opponentCode, setOpponentCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [socketReady, setSocketReady] = useState(false);

  const socketRef = useRef();
  const currentUserRef = useRef(null);

  // Initialize socket after auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUserRef.current = { uid: user.uid, displayName: user.displayName || "Anonymous" };
        initializeSocket();
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      unsubscribe();
    };
  }, []);

  const initializeSocket = () => {
    socketRef.current = io("http://localhost:5001");

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setSocketReady(true);
    });

    socketRef.current.on("queueStatus", (data) => {
      console.log("Queue status:", data);
    });

    socketRef.current.on("queueUpdated", (data) => {
      console.log("Queue length:", data.length);
    });

    socketRef.current.on("matchFound", (matchData) => {
      setCurrentMatch(matchData);
      setMatchStatus("in_match");
      socketRef.current.emit("joinMatch", matchData.matchId);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("codeUpdate", (newCode) => {
      setOpponentCode(newCode);
    });
  };

  const handleMatchFound = (matchData) => {
    setCurrentMatch(matchData);
    setMatchStatus("in_match");
  };

  const handleCancelQueue = () => {
    setMatchStatus("idle");
    if (socketRef.current) socketRef.current.emit("leaveQueue");
  };

  const sendMessage = (messageInput, setMessageInput) => {
    if (!messageInput.trim() || !currentMatch) {
      console.warn("Cannot send message: match not initialized yet");
      return;
    }
    console.log("Current match:", currentMatch); // Debug log

    const msgData = {
      matchId: currentMatch.matchId,   // safe now
      message: messageInput,
      user: currentUserRef.current.displayName,
    };

    socketRef.current.emit("sendMessage", msgData);

    // Add message locally for instant feedback
    setChatMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
    setMessageInput("");
  };


  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    if (socketRef.current && currentMatch) {
      socketRef.current.emit("codeUpdate", { matchId: currentMatch.id, code: newCode });
    }
  };

  // Queue screen
  if (matchStatus === "idle" || matchStatus === "queuing") {
    return (
      <>
        <Navbar />
        <div className="matchmaking-container">
          <h2>Find a Coding Match</h2>
          <Queue
            socket={socketRef.current}
            socketReady={socketReady}
            currentUser={currentUserRef.current}
            onMatchFound={handleMatchFound}
            onCancel={handleCancelQueue}
          />
        </div>
      </>
    );
  }

  // In-match screen
  return (
    <>
      <Navbar />
      <div className="livematch-container">
        <h3>Match against: {currentMatch?.opponent}</h3>
        <div className="match-editor-section">
          <MatchEditor code={userCode} onCodeChange={handleCodeChange} />
        </div>

        <div className="opponent-code-section">
          <h4>Opponent's Code:</h4>
          <pre>{opponentCode}</pre>
        </div>

        <div className="chat-section">
          <h4>Live Chat</h4>
          <Chat
            chatMessages={chatMessages}
            currentUser={currentUserRef.current}
            onSend={sendMessage}
          />
        </div>
      </div>
    </>
  );
};

const Chat = ({ chatMessages, currentUser, onSend }) => {
  const [messageInput, setMessageInput] = useState("");
  const chatEndRef = useRef();

  const handleSend = () => {
    onSend(messageInput, setMessageInput);
  };

  // Auto scroll
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.user === currentUser.displayName ? "self" : "opponent"}`}
          >
            <strong>{msg.user}: </strong>
            {msg.message}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default LiveMatch;