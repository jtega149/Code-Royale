import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MatchEditor from "../components/MatchEditor";
import "./Styles/LiveMatch.css";

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

  const [leftWidth, setLeftWidth] = useState(500);
  const [opponentHeight, setOpponentHeight] = useState(200);
  const [editorHeight, setEditorHeight] = useState(400);

  const containerRef = useRef();

  // Send chat message (frontend only)
  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const msg = { user: "You", message: messageInput };
      setChatMessages((prev) => [...prev, msg]);
      setMessageInput("");
    }
  };

  // Handle code change (frontend only)
  const handleCodeChange = (newCode) => {
    console.log("User code changed:", newCode);
  };

  // Resizing handlers
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

  return (
    <>
      <Navbar />
      <div className="submit-container">
        <button className="submit-button">Submit</button>
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
                  />
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
