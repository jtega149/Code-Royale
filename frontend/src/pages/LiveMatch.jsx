import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import MatchEditor from "../components/MatchEditor";
import { io } from "socket.io-client";
import "./Styles/LiveMatch.css";

const socket = io("http://localhost:5001"); // your backend URL
const MATCH_ID = "match123"; // dynamically assign a unique match ID per match

const LiveMatch = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    // join match room
    socket.emit("joinMatch", MATCH_ID);

    // listen for messages from server
    socket.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const msg = { user: "You", message: messageInput };
      socket.emit("sendMessage", { matchId: MATCH_ID, message: messageInput, user: "Opponent" });
      setChatMessages((prev) => [...prev, msg]); // show locally
      setMessageInput("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="livematch-chat">
        <h3>Live Chat</h3>
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
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default LiveMatch;