// src/pages/LiveMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import MatchEditor from "../components/MatchEditor";
import Queue from "../components/Queue";
import { io } from "socket.io-client";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Styles/LiveMatch.css";

// Import your problems data (adjust the path as needed)
import problemsData from "../LeetcodePoblems.js";

const LiveMatch = () => {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchStatus, setMatchStatus] = useState("idle");
  const [chatMessages, setChatMessages] = useState([]);
  const [opponentCode, setOpponentCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [socketReady, setSocketReady] = useState(false);
  const [output, setOutput] = useState("");
  const [canRun, setCanRun] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [allProblems, setAllProblems] = useState([]);

  const socketRef = useRef();
  const currentUserRef = useRef(null);

  // Flatten and combine all problems from all difficulty levels
  useEffect(() => {
    const flattenedProblems = [];
    
    // Combine problems from all difficulty levels
    Object.values(problemsData).forEach(difficultyCategory => {
      Object.values(difficultyCategory).forEach(problem => {
        flattenedProblems.push(problem);
      });
    });
    
    setAllProblems(flattenedProblems);
  }, []);

  // Function to get a random problem
  const getRandomProblem = () => {
    if (allProblems.length === 0) {
      // Fallback problem if no problems are loaded
      return {
        name: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        hints: ["Use a hash map", "Iterate once", "Check complement for each element"],
        tests: [
          { input: [[2,7,11,15], 9], output: [0,1] },
          { input: [[3,2,4], 6], output: [1,2] },
          { input: [[3,3], 6], output: [0,1] }
        ]
      };
    }
    
    const randomIndex = Math.floor(Math.random() * allProblems.length);
    return allProblems[randomIndex];
  };

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
      // Add random problem to match data
      const randomProblem = getRandomProblem();
      const enhancedMatchData = {
        ...matchData,
        problem: randomProblem
      };
      setCurrentMatch(enhancedMatchData);
      setMatchStatus("in_match");
      socketRef.current.emit("joinMatch", enhancedMatchData.matchId);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("codeUpdate", (newCode) => {
      setOpponentCode(newCode);
    });
  };

  const handleMatchFound = (matchData) => {
    // Add random problem to match data
    const randomProblem = getRandomProblem();
    const enhancedMatchData = {
      ...matchData,
      problem: randomProblem
    };
    setCurrentMatch(enhancedMatchData);
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
      socketRef.current.emit("codeUpdate", {
        matchId: currentMatch.matchId,
        code: newCode
      });
    }
  };

  // Enhanced runCode function that can handle different problem structures
  const runCode = async () => {
    if (!canRun) {
      alert("Please wait a few seconds before running again.");
      return;
    }
    setCanRun(false);
    setTimeout(() => setCanRun(true), 5000);
    setOutput("Running code...");

    try {
      // Prepare input based on problem type
      let stdin = "";
      if (currentMatch?.problem?.tests && currentMatch.problem.tests.length > 0) {
        // Use the first test case as input
        const firstTest = currentMatch.problem.tests[0];
        if (Array.isArray(firstTest.input)) {
          stdin = JSON.stringify(firstTest.input);
        } else {
          stdin = firstTest.input.toString();
        }
      } else if (currentMatch?.problem?.input) {
        stdin = currentMatch.problem.input;
      }

      const data = JSON.stringify({
        language: language,
        files: [{ name: "main", content: userCode }],
        stdin: stdin
      });

      const response = await fetch("https://onecompiler-apis.p.rapidapi.com/api/v1/run", {
        method: "POST",
        headers: {
          "x-rapidapi-key": "81cd88f2b5mshead5861260f3e6cp17b68bjsnfd5fccc343dc",
          "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: data,
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("API key invalid or unauthorized.");
        if (response.status === 429) throw new Error("Rate limit exceeded. Please wait.");
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(`Error:\n${result.stderr}`);
      } else if (result.exception) {
        setOutput(`Exception:\n${result.exception}`);
      } else if (result.output) {
        setOutput(result.output);
      } else if (result.message) {
        setOutput(result.message);
      } else {
        setOutput(`Unexpected response format. Raw response:\n${JSON.stringify(result, null, 2)}`);
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleSubmit = () => {
    runCode();
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
      <div className="language-select">
        <label htmlFor="language">Language: </label>
        <select 
          id="language" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
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
              <h3>Problem: {currentMatch?.problem?.name || "Random Problem"}</h3>
              <div className="problem-description">
                <p>{currentMatch?.problem?.description || "No description available."}</p>
                <div className="problem-io">
                  <h4>Input:</h4>
                  <pre>{currentMatch?.problem?.input || "See test cases below"}</pre>
                  <h4>Output:</h4>
                  <pre>{currentMatch?.problem?.output || "See test cases below"}</pre>
                </div>
                {currentMatch?.problem?.hints && (
                  <div className="hints-section">
                    <h4>Hints:</h4>
                    <ul>
                      {currentMatch.problem.hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
                {currentMatch?.problem?.tests ? (
                  currentMatch.problem.tests.map((testCase, index) => (
                    <div key={index} className="test-case">
                      <h5>Test Case {index + 1}</h5>
                      <p><strong>Input:</strong> {JSON.stringify(testCase.input)}</p>
                      <p><strong>Expected Output:</strong> {JSON.stringify(testCase.output)}</p>
                      <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                    </div>
                  ))
                ) : (
                  // Fallback test cases if none provided
                  <>
                    <div className="test-case">
                      <h5>Sample Test Case 1</h5>
                      <p><strong>Input:</strong> Check problem description</p>
                      <p><strong>Expected Output:</strong> Check problem description</p>
                      <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Output section */}
            <div className="output-section">
              <h4>Output:</h4>
              <pre>{output}</pre>
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