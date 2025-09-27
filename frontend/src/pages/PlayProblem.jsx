// src/pages/PlayProblem.jsx
import React, { useState, useEffect } from "react";
import "./Styles/PlayProblem.css";
import Navbar from "../components/Navbar";

const PlayProblem = () => {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const data = await import("../LeetcodeProblems.JSON");
        
        if (!data.default || typeof data.default !== 'object') {
          throw new Error("Invalid JSON structure");
        }
        
        setLeetcodeData(data.default);
        setError(null);
      } catch (err) {
        console.error("Failed to load Leetcode problems:", err);
        setError(`Failed to load problems: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Flatten all problems with their difficulty
  const getAllProblems = () => {
    if (!leetcodeData) return [];
    
    const problems = [];
    Object.keys(leetcodeData).forEach(difficulty => {
      Object.keys(leetcodeData[difficulty]).forEach(problemName => {
        problems.push({
          name: problemName,
          difficulty: difficulty,
          data: leetcodeData[difficulty][problemName]
        });
      });
    });
    
    return problems;
  };

  const getDifficultyClass = (difficulty) => {
    return `difficulty-${difficulty.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading LeetCode problems...</h2>
        <p>Please wait while we load the problem data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Problems</h2>
        <p>{error}</p>
        <p>Please check the browser console for details.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!leetcodeData) {
    return (
      <div className="empty-container">
        <h2>No problems data available</h2>
        <p>Try refreshing the page or check the JSON file.</p>
      </div>
    );
  }

  const allProblems = getAllProblems();

  return (
    <>
    <Navbar />
    <div className="playproblem-container">
      {/* Problems List Sidebar */}
      <div className="problems-sidebar">
        <div className="sidebar-header">
          <h1>LeetCode Problems</h1>
          <p>{allProblems.length} problems total</p>
        </div>
        
        <div className="problems-list">
          {allProblems.map((problem) => (
            <div
              key={`${problem.difficulty}-${problem.name}`}
              className={`problem-card ${selectedProblem?.name === problem.name ? 'selected' : ''}`}
              onClick={() => setSelectedProblem(problem)}
            >
              <div className="problem-header">
                <h3 className="problem-name">{problem.name}</h3>
                <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <p className="problem-preview">
                {problem.data.description.split('\n')[0]}
              </p>
              
              <div className="problem-meta">
                <span>{problem.data.tests?.length || 0} test cases</span>
                <span>Click to view</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Details Panel */}
      <div className="details-panel">
        {selectedProblem ? (
          <div className="problem-details">
            <div className="problem-title-section">
              <div className="problem-title">
                <h1>{selectedProblem.name}</h1>
                <span className={`title-difficulty-badge ${getDifficultyClass(selectedProblem.difficulty)}`}>
                  {selectedProblem.difficulty}
                </span>
              </div>
              
              <div className="problem-stats">
                <span>📊 {selectedProblem.data.tests?.length || 0} test cases</span>
                <span>⚡ {selectedProblem.difficulty} level</span>
              </div>
            </div>

            <div className="description-section">
              <h2>Problem Description</h2>
              <pre className="problem-description">
                {selectedProblem.data.description}
              </pre>
            </div>

            <div className="tests-section">
              <h2>Sample Test Cases</h2>
              <div className="test-cases-container">
                {selectedProblem.data.tests?.map((test, index) => (
                  <div key={index} className="test-case-card">
                    <h3>Test Case {index + 1}</h3>
                    <div className="test-input-output">
                      <div className="test-input">
                        <strong>Input:</strong>
                        <div className="code-block">
                          {JSON.stringify(test.input)}
                        </div>
                      </div>
                      <div className="test-output">
                        <strong>Expected Output:</strong>
                        <div className="code-block output-block">
                          {JSON.stringify(test.output)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <br/>
            <button className="attempt-problem">Attempt Problem</button>
          </div>
        ) : (
          <div className="empty-state">
            <div>
              <h2>Select a Problem</h2>
              <p>Choose a problem from the list to view its details and test cases.</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default PlayProblem;