import React from 'react'
import Navbar from '../components/Navbar'

const Match = () => {
  return (
    <>
        <Navbar />
        <div className="match-container">
          <h1>Start Code Royale Match</h1>
          <div className="play-online">
            <button className="play-button">Play Online</button>
          </div>
          <div className="play-a-friend">
            <button className="play-button">Play a Friend</button>
          </div>
          <div className="practice-mode">
            <button className="play-button">Practice Mode</button>
          </div>
          <div className="play-specific-problem">
            <button className="play-button">Play Specific Problem</button>
          </div>
        </div>
    </>
  )
}

export default Match