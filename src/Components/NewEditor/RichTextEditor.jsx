import React, { useRef } from "react";

import "./Editor.css";

import Toolbar from "./ToolBar/Toolbar";
import Editor from "./Editor/Editor";

const RichTextEditor = ({ handleBlur: callback, value }) => {
  const editorRef = useRef(null);

  const handleBlur = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML; // Get the HTML content
      callback(htmlContent); // Pass the content to the onSave function
    }
  };

  return (
    <div className="bg-white">
      <Toolbar editorRef={editorRef} />
      <Editor editorRef={editorRef} handleBlur={handleBlur} value={value} />
    </div>
  );
};

export default RichTextEditor;
