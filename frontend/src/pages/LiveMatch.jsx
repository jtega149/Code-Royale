// src/pages/LiveMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import MatchEditor from "../components/MatchEditor";
import { io } from "socket.io-client";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Styles/LiveMatch.css";

const MATCH_ID = "match123"; // dynamically assign per match

const problem = {
  title: "Two Sum",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  input: "nums = [2,7,11,15], target = 9",
  output: "[0,1]",
  solution: "def twoSum(nums, target): ...",
  hints: ["Use a hash map", "Iterate once", "Check complement for each element"]
};

const LiveMatch = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [opponentCode, setOpponentCode] = useState("def example():\n    pass");
  const [userCode, setUserCode] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null); // Track auth state
  const [loading, setLoading] = useState(true); // Loading state

  const [leftWidth, setLeftWidth] = useState(500);
  const [opponentHeight, setOpponentHeight] = useState(200);
  const [editorHeight, setEditorHeight] = useState(400);

  const containerRef = useRef();
  const socketRef = useRef();

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
        const userDisplayName = currentUser.displayName || 
                               currentUser.email || 
                               `User${currentUser.uid.slice(-4)}`;
        setUsername(userDisplayName);
        console.log("User authenticated:", userDisplayName);
      } else {
        // User is signed out
        setUser(null);
        setUsername("");
        console.log("User not authenticated");
        // Optional: redirect to login page
        // navigate('/login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Socket connection - only establish when user is authenticated
  useEffect(() => {
    if (!user) return; // Don't connect socket if user not authenticated

    setLoading(true);
    
    // Create socket connection
    socketRef.current = io("http://localhost:5001");

    // Join match room with user info
    socketRef.current.emit("joinMatch", MATCH_ID);

    // Set up event listeners
    socketRef.current.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("codeUpdate", (newCode) => {
      setOpponentCode(newCode);
    });

    // Socket connection established
    socketRef.current.on("connect", () => {
      console.log("Socket connected with ID:", socketRef.current.id);
      setLoading(false);
    });

    // Handle connection errors
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setLoading(false);
    });

    // Cleanup on unmount or when user changes
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.off("codeUpdate");
        socketRef.current.off("connect");
        socketRef.current.off("connect_error");
        socketRef.current.disconnect();
      }
    };
  }, [user]); // Re-run when user auth state changes

  // Send chat message with Firebase user info
  const sendMessage = () => {
    if (messageInput.trim() !== "" && socketRef.current && user) {
      const myMsg = { user: "You", message: messageInput };
      setChatMessages((prev) => [...prev, myMsg]);

      // Send as plain object with expected fields
      socketRef.current.emit("sendMessage", {
        matchId: MATCH_ID,
        message: messageInput,
        user: username
      });

      setMessageInput("");
    }
  };

  // Send code updates to opponent
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    if (socketRef.current && user) {
      socketRef.current.emit("codeUpdate", { 
        matchId: MATCH_ID, 
        code: newCode,
        userId: user.uid // Optional: include user ID
      });
    }
  };

  // Resizing handlers (same as before)
  const handleColumnResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    const doDrag = (dragEvent) => {
      const newLeftWidth = startWidth + (dragEvent.clientX - startX);
      const containerWidth = containerRef.current.offsetWidth;
      if (newLeftWidth > 300 && newLeftWidth < containerWidth - 300) {
        setLeftWidth(newLeftWidth);
      }
    };
    const stopDrag = () => {
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleOpponentResize = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = opponentHeight;
    const doDrag = (dragEvent) => {
      const newHeight = startHeight + (dragEvent.clientY - startY);
      if (newHeight > 100 && newHeight < 500) setOpponentHeight(newHeight);
    };
    const stopDrag = () => {
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleEditorResize = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = editorHeight;
    const doDrag = (dragEvent) => {
      const newHeight = startHeight + (dragEvent.clientY - startY);
      if (newHeight > 200 && newHeight < 800) setEditorHeight(newHeight);
    };
    const stopDrag = () => {
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <p>Loading match...</p>
        </div>
      </>
    );
  }

  // Show auth required message
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="auth-required-container">
          <p>Please sign in to join the match.</p>
          {/* Optional: Add login button or redirect */}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="submit-container">
        <button className="submit-button">Submit</button>
        <span className="user-info">Logged in as: {username}</span>
      </div>

      <div className="livematch-container" ref={containerRef}>
        {/* Left Column */}
        <div className="left-column" style={{ width: leftWidth }}>
          <div className="problem-section">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <div className="examples">
              <h4>Example Input:</h4>
              <pre>{problem.input}</pre>
              <h4>Example Output:</h4>
              <pre>{problem.output}</pre>
              <h4>Correct Solution:</h4>
              <pre>{problem.solution}</pre>
            </div>
            <div className="hints">
              <h4>Hints:</h4>
              <ol>
                {problem.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ol>
            </div>

            {/* Opponent Section */}
            <div className="opponent-chat">
              <h3>Opponent</h3>
              <div
                className="resizable-opponent"
                style={{ height: opponentHeight }}
              >
                <pre className="blurred-code">{opponentCode}</pre>
                <div
                  className="opponent-resizer"
                  onMouseDown={handleOpponentResize}
                />
              </div>

              <button
                className="toggle-chat"
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? "Hide Chat" : "Show Chat"}
              </button>

              {showChat && (
                <div className="chat-box">
                  <div className="chat-messages">
                    {chatMessages.map((msg, idx) => (
                      <p key={idx}>
                        <strong>{msg.user}:</strong> {msg.message}
                      </p>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={!user} // Disable if not authenticated
                  />
                  <button onClick={sendMessage} disabled={!user}>
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column Resizer */}
        <div className="column-resizer" onMouseDown={handleColumnResize}></div>

        {/* Right Column */}
        <div className="right-column">
          <h3>Your Code Editor</h3>
          <div className="editor-container" style={{ height: editorHeight }}>
            <MatchEditor problem={problem} onCodeChange={handleCodeChange} />
            <div className="editor-resizer" onMouseDown={handleEditorResize} />
          </div>

          <div className="testcases">
            <h4>Test Cases</h4>
            <div className="testcase">
              <pre>Input: [2,7,11,15], target = 9</pre>
              <pre>Output: [0,1]</pre>
            </div>
            <div className="testcase">
              <pre>Input: [3,2,4], target = 6</pre>
              <pre>Output: [1,2]</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveMatch;