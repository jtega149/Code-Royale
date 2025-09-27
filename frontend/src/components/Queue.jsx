// src/components/Queue.jsx
import React, { useEffect, useState } from "react";

const Queue = ({ socket, socketReady, currentUser, onMatchFound, onCancel }) => {
  const [queueStatus, setQueueStatus] = useState("idle");
  const [position, setPosition] = useState(null);
  const [estimatedWait, setEstimatedWait] = useState(null);
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on("queueStatus", (data) => {
      console.log("Queue status:", data);
      if (data.status === "joined") {
        setQueueStatus("joined");
        setPosition(data.position);
        setEstimatedWait(data.estimatedWait);
      } else if (data.status === "already_in_queue") {
        setQueueStatus("joined");
      } else if (data.status === "left") {
        setQueueStatus("idle");
      } else if (data.status === "error") {
        alert(`Queue error: ${data.error}`);
        setQueueStatus("idle");
      }
    });

    socket.on("queueUpdated", (data) => {
      setQueueLength(data.length);
    });

    socket.on("matchFound", (matchData) => {
      onMatchFound(matchData);
    });

    return () => {
      socket.off("queueStatus");
      socket.off("queueUpdated");
      socket.off("matchFound");
    };
  }, [socket, onMatchFound]);

  const joinQueue = () => {
    if (!socket || !socket.connected) {
      alert("Socket not ready yet. Please wait...");
      return;
    }
    if (!currentUser) {
      alert("User not ready yet. Try again in a moment.");
      return;
    }
    socket.emit("joinQueue", {
      userId: currentUser.uid,
      username: currentUser.displayName,
      skillLevel: 1,
    });
    setQueueStatus("waiting");
  };

  const leaveQueue = () => {
    if (!socket) return;
    socket.emit("leaveQueue");
    setQueueStatus("idle");
    if (onCancel) onCancel();
  };

  return (
    <div className="queue-container">
      <p>Players currently in queue: {queueLength}</p>

      {queueStatus === "idle" && (
        <button onClick={joinQueue} disabled={!socketReady}>
          {socketReady ? "Join Queue" : "Connecting..."}
        </button>
      )}

      {(queueStatus === "waiting" || queueStatus === "joined") && (
        <div>
          <p>{queueStatus === "waiting" ? "Waiting for an opponent..." : "You're in the queue!"}</p>
          {position && <p>Position: {position}</p>}
          {estimatedWait && <p>Estimated wait: {estimatedWait} seconds</p>}
          <button onClick={leaveQueue}>Leave Queue</button>
        </div>
      )}
    </div>
  );
};

export default Queue;