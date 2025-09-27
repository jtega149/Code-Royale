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
  const [matchStatus, setMatchStatus] = useState("idle");
  const [chatMessages, setChatMessages] = useState([]);
  const [opponentCode, setOpponentCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [socketReady, setSocketReady] = useState(false);

  const socketRef = useRef();
  const currentUserRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedProfile = localStorage.getItem("profile");
        let displayName = "Anonymous";
        
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile);
            displayName = profile.name || user.displayName || "Anonymous";
          } catch (error) {
            console.error("Error parsing profile:", error);
            displayName = user.displayName || "Anonymous";
          }
        } else {
          displayName = user.displayName || "Anonymous";
        }
        
        currentUserRef.current = { 
          uid: user.uid, 
          displayName: displayName 
        };
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

    const msgData = {
      matchId: currentMatch.matchId,
      message: messageInput,
      user: currentUserRef.current.displayName,
    };

    socketRef.current.emit("sendMessage", msgData);
    setMessageInput("");
  };

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    if (socketRef.current && currentMatch) {
      socketRef.current.emit("codeUpdate", { matchId: currentMatch.matchId, code: newCode });
    }
  };

  const handleSubmit = () => {
    console.log("Submitting code:", userCode);
    alert("Code submitted! (Functionality to be implemented)");
  };

  if (matchStatus === "idle" || matchStatus === "queuing") {
    return (
      <>
        <Navbar />
        <div className="matchmaking-container dark-theme">
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

  return (
    <>
      <Navbar />
      <div className="livematch-container dark-theme">
        <div className="submit-section">
          <button className="submit-button" onClick={handleSubmit}>
            Submit Solution
          </button>
        </div>

        <div className="match-layout">
          {/* Left Column - Question, Opponent Screen, Chat */}
          <div className="left-column">
            <div className="problem-section">
              <h3>Problem: {currentMatch?.problem?.title || "Two Sum"}</h3>
              <div className="problem-description">
                <p>{currentMatch?.problem?.description || 
                  "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."}
                </p>
                <div className="problem-io">
                  <h4>Input:</h4>
                  <pre>{currentMatch?.problem?.input || "nums = [2,7,11,15], target = 9"}</pre>
                  <h4>Output:</h4>
                  <pre>{currentMatch?.problem?.output || "[0,1]"}</pre>
                </div>
                <div className="hints-section">
                  <h4>Hints:</h4>
                  <ul>
                    {(currentMatch?.problem?.hints || ["Use a hash map", "Iterate once", "Check complement for each element"]).map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="opponent-screen-section">
              <h4>Opponent's Screen</h4>
              <div className="blurred-screen">
                <div className="blur-content">
                  <p>Opponent's code is hidden during the match</p>
                  <div className="blur-effect"></div>
                </div>
              </div>
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

          {/* Right Column - Code Editor and Test Cases */}
          <div className="right-column">
            <div className="editor-section">
              <h4>Your Code</h4>
              <MatchEditor code={userCode} onCodeChange={handleCodeChange} />
            </div>

            <div className="test-cases-section">
              <h4>Test Cases</h4>
              <div className="test-cases">
                <div className="test-case">
                  <h5>Sample Test Case 1</h5>
                  <p><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
                  <p><strong>Expected Output:</strong> [0,1]</p>
                  <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                </div>
                <div className="test-case">
                  <h5>Sample Test Case 2</h5>
                  <p><strong>Input:</strong> nums = [3,2,4], target = 6</p>
                  <p><strong>Expected Output:</strong> [1,2]</p>
                  <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                </div>
                <div className="test-case">
                  <h5>Sample Test Case 3</h5>
                  <p><strong>Input:</strong> nums = [3,3], target = 6</p>
                  <p><strong>Expected Output:</strong> [0,1]</p>
                  <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Chat = ({ chatMessages, currentUser, onSend }) => {
  const [messageInput, setMessageInput] = useState("");
  const chatEndRef = useRef();
  const chatMessagesRef = useRef();

  const handleSend = () => {
    if (messageInput.trim()) {
      onSend(messageInput, setMessageInput);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatMessagesRef}>
        {chatMessages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.user === currentUser.displayName ? "self" : "opponent"}`}
            >
              <strong>{msg.user}: </strong>
              {msg.message}
            </div>
          ))
        )}
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