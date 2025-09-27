// src/components/MatchEditor.jsx
import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python"; // change mode as needed
import "ace-builds/src-noconflict/theme-monokai"; // choose theme you like
import "./Styles/MatchEditor.css";

const MatchEditor = ({ problem, onCodeChange }) => {
  const [code, setCode] = useState("");

  // Update code locally and notify parent component / backend
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  return (
    <div className="editor-container">
      <div className="code-editor">
        <AceEditor
          mode="python"
          theme="monokai"
          name="code-editor"
          value={code}
          onChange={handleCodeChange}
          fontSize={16}
          width="100%"
          height="400px"
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
};

export default MatchEditor;