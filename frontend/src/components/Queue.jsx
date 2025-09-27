// src/components/Queue.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const Queue = ({ onMatchFound, onCancel }) => {
  const [queueStatus, setQueueStatus] = useState('idle'); // idle, waiting, matched, error
  const [position, setPosition] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket connection would be passed as prop or from context
    // For now, we'll assume it's passed as prop
    return () => {
      if (socket) {
        socket.emit('leaveQueue', { userId: auth.currentUser?.uid });
      }
    };
  }, [socket]);

  const joinQueue = () => {
    if (!auth.currentUser) {
      alert('Please sign in to join queue');
      return;
    }

    const userData = {
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName || auth.currentUser.email,
      skillLevel: 1 // You can implement skill rating system
    };

    socket.emit('joinQueue', userData);
    setQueueStatus('waiting');
  };

  const leaveQueue = () => {
    if (socket) {
      socket.emit('leaveQueue', { userId: auth.currentUser?.uid });
    }
    setQueueStatus('idle');
    onCancel?.();
  };

  // Socket event listeners would be set up in parent component

  return (
    <div className="queue-container">
      {queueStatus === 'idle' && (
        <button onClick={joinQueue} className="join-queue-btn">
          Join Matchmaking Queue
        </button>
      )}

      {queueStatus === 'waiting' && (
        <div className="waiting-container">
          <div className="searching-animation">
            <span>Searching for opponent</span>
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
          <p>Position in queue: {position}</p>
          <p>Estimated wait: {estimatedWait} seconds</p>
          <button onClick={leaveQueue} className="leave-queue-btn">
            Cancel Search
          </button>
        </div>
      )}

      {queueStatus === 'matched' && (
        <div className="match-found">
          <h3>Match Found!</h3>
          <p>Connecting to match...</p>
        </div>
      )}
    </div>
  );
};

export default Queue;