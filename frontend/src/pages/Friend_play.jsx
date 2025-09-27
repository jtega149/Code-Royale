import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Friend_play.css";

const Friend_play = () => {
  const [rooms, setRooms] = useState({}); // Stores rooms in memory: { roomName: password }
  const [createName, setCreateName] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null); // Room the player created or joined
  const [waiting, setWaiting] = useState(false);

  const handleCreateRoom = () => {
    if (!createName || !createPassword) {
      alert("Please enter both name and password");
      return;
    }

    if (rooms[createName]) {
      alert("Room name already exists. Choose a different name.");
      return;
    }

    setRooms((prev) => ({ ...prev, [createName]: createPassword }));
    setCurrentRoom(createName);
    setWaiting(true);
  };

  const handleJoinRoom = () => {
    if (!joinName || !joinPassword) {
      alert("Please enter both name and password");
      return;
    }

    if (!rooms[joinName]) {
      alert("Room not found. Check the name.");
      return;
    }

    if (rooms[joinName] !== joinPassword) {
      alert("Incorrect password. Try again.");
      return;
    }

    setCurrentRoom(joinName);
    setWaiting(true);
  };

  return (
    <div className="friend-play-page">
      <Navbar />

      <div className="content">
        <h1>Play with a Friend</h1>

        {!currentRoom && (
          <div className="friend-options">
            <div className="option-card-container">
              <h2>Create Room</h2>
              <input
                type="text"
                placeholder="Room Name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
              />
              <button onClick={handleCreateRoom}>Create Room</button>
            </div>

            <div className="option-card-container">
              <h2>Join Room</h2>
              <input
                type="text"
                placeholder="Room Name"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
              />
              <button onClick={handleJoinRoom}>Join Room</button>
            </div>
          </div>
        )}

        {currentRoom && waiting && (
          <div className="waiting-screen">
            <h2>Room: {currentRoom}</h2>
            <p>Waiting for opponent...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friend_play;
