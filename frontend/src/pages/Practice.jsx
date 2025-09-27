import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Styles/Practice.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import LeetcodeProblems from "../LeetcodePoblems";

const Practice = () => {
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [problemNumber, setProblemNumber] = useState(1);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [canRun, setCanRun] = useState(true);
  const [currentProblem, setCurrentProblem] = useState(null);

  const timerDurations = { easy: 300, medium: 600, hard: 900 };

  // Set timer when difficulty/language selected
  useEffect(() => {
    if (difficulty && language) setTimeLeft(timerDurations[difficulty]);
  }, [difficulty, language]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      alert("Time's up!");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Randomly select problem
  useEffect(() => {
    if (difficulty) {
      const problemsArray = Object.values(
        LeetcodeProblems[difficulty.charAt(0).toUpperCase() + difficulty.slice(1)]
      );
      const randomProblem = problemsArray[Math.floor(Math.random() * problemsArray.length)];
      setCurrentProblem(randomProblem);
    }
  }, [difficulty, problemNumber]);

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

  // Run user code against test cases
  const runCode = async () => {
    if (!canRun) {
      alert("Please wait a few seconds before running again.");
      return;
    }
    setCanRun(false);
    setTimeout(() => setCanRun(true), 5000);

    if (!currentProblem) return;

    setOutput("Running code on test cases...");

    try {
      const tests = currentProblem.tests;
      let results = "";

      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        let userOutput = "";

        // Prepare code execution
        let content = code;

        if (language === "python") {
          content = `
def user_func():
${code.split("\n").map((l) => "    " + l).join("\n")}
result = user_func()
print(result)
`;
        } else if (language === "javascript") {
          content = `
function userFunc() {
${code.split("\n").map((l) => "  " + l).join("\n")}
}
console.log(userFunc());
`;
        } else if (language === "java") {
          content = `
public class Main {
  public static Object userFunc() {
${code.split("\n").map((l) => "    " + l).join("\n")}
  }
  public static void main(String[] args) {
    System.out.println(userFunc());
  }
}
`;
        }

        const data = JSON.stringify({
          language: language,
          files: [{ name: "main", content }],
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

        const result = await response.json();
        userOutput = result.stdout ? result.stdout.trim() : result.stderr || "No output";

        const passFail = userOutput == JSON.stringify(test.output) || userOutput == test.output ? "Passed" : "Failed";
        results += `Test Case ${i + 1}: ${passFail}\nInput: ${JSON.stringify(test.input)}\nExpected: ${JSON.stringify(test.output)}\nOutput: ${userOutput}\n\n`;
      }

      setOutput(results);
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

        {/* Difficulty & language selection */}
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
                    className={`option-card javascript ${language === "javascript" ? "selected" : ""}`}
                    onClick={() => setLanguage("javascript")}
                  >
                    JavaScript
                  </div>
                  <div
                    className={`option-card python ${language === "python" ? "selected" : ""}`}
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
        {difficulty && language && currentProblem && (
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
                <p>{currentProblem.description}</p>
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
