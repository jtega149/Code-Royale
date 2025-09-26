import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Styles/Practice.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

const Practice = () => {
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [problemNumber, setProblemNumber] = useState(1);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [canRun, setCanRun] = useState(true);

  const timerDurations = { easy: 300, medium: 600, hard: 900 };

  useEffect(() => {
    if (difficulty && language) setTimeLeft(timerDurations[difficulty]);
  }, [difficulty, language]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      alert("Time's up!");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      default:
        return javascript();
    }
  };

  const runCode = async () => {
    if (!canRun) {
      alert("Please wait a few seconds before running again.");
      return;
    }

    setCanRun(false);
    setTimeout(() => setCanRun(true), 5000);

    setOutput("Running code...");

    try {
      const data = JSON.stringify({
        language: language,
        files: [{ name: "main", content: code }],
      });

      const response = await fetch(
        "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        {
          method: "POST",
          headers: {
            "x-rapidapi-key":
              "81cd88f2b5mshead5861260f3e6cp17b68bjsnfd5fccc343dc",
            "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          body: data,
        }
      );

      if (!response.ok) {
        if (response.status === 403)
          throw new Error("API key invalid or unauthorized.");
        if (response.status === 429)
          throw new Error("Rate limit exceeded. Please wait.");
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.stdout) setOutput(result.stdout);
      else if (result.stderr) setOutput(`Error:\n${result.stderr}`);
      else if (result.output) setOutput(result.output);
      else setOutput("No output returned. Make sure your code prints/logs something.");
    } catch (err) {
      setOutput(err.message);
    }
  };

  const getTimerClass = () => {
    if (timeLeft <= 30) return "timer flashing";
    if (timeLeft <= 60) return "timer red";
    if (timeLeft <= 120) return "timer yellow";
    return "timer";
  };

  return (
    <div className="practice-page">
      <Navbar />

      <div className="content">
        <h1>Practice Problems</h1>

        {/* Difficulty first, then language */}
        {!(difficulty && language) && (
          <div className="options professional-options">
            <h2>Select Difficulty & Language</h2>

            <div className="option-cards">
              <div
                className={`option-card easy ${difficulty === "easy" ? "selected" : ""}`}
                onClick={() => setDifficulty("easy")}
              >
                Easy
              </div>
              <div
                className={`option-card medium ${difficulty === "medium" ? "selected" : ""}`}
                onClick={() => setDifficulty("medium")}
              >
                Medium
              </div>
              <div
                className={`option-card hard ${difficulty === "hard" ? "selected" : ""}`}
                onClick={() => setDifficulty("hard")}
              >
                Hard
              </div>
            </div>

            {difficulty && (
              <>
                <h3 style={{ marginTop: "20px" }}>Select Language</h3>
                <div className="option-cards">
                  <div
                    className={`option-card javascript ${
                      language === "javascript" ? "selected" : ""
                    }`}
                    onClick={() => setLanguage("javascript")}
                  >
                    JavaScript
                  </div>
                  <div
                    className={`option-card python ${
                      language === "python" ? "selected" : ""
                    }`}
                    onClick={() => setLanguage("python")}
                  >
                    Python
                  </div>
                  <div
                    className={`option-card java ${language === "java" ? "selected" : ""}`}
                    onClick={() => setLanguage("java")}
                  >
                    Java
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Main problem display */}
        {difficulty && language && (
          <>
            <div className="practice-header">
              <h2>Problem {problemNumber}</h2>
              <h3 className={getTimerClass()}>Time Left: {formatTime(timeLeft)}</h3>
            </div>

            <div className="practice-body">
              <div className="practice-question">
                <h3>
                  {difficulty.toUpperCase()} Problem ({language.toUpperCase()})
                </h3>
                <p>
                  Placeholder problem description. Will load from JSON later with 2 test cases.
                </p>
              </div>

              <div className="practice-editor">
                <CodeMirror
                  value={code}
                  height="500px"
                  extensions={[getLanguageExtension()]}
                  theme="dark"  
                  onChange={(value) => setCode(value)}
                  style={{ textAlign: "left" }}
                />
                <button className="btn run-btn" onClick={runCode}>
                  Run Code
                </button>
                <div className="output-panel">
                  <h4>Output:</h4>
                  <pre>{output}</pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Practice;
