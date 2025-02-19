import React, { useEffect, useState } from "react";
import Editor from "./Editor"; // Import your existing Editor component

const EditorWrapper = ({ onSave, initialTitle = "", initialContent = "" }) => {
  const [title, setTitle] = useState(initialTitle); // State for the page title
  const [content, setContent] = useState(initialContent); // State for the editor content

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle content change (passed to the Editor component)
  const handleContentChange = (type, value) => {
    setContent(value);

    onSave(type, value);
  };

  return (
    <div className="editor-wrapper bg-white rounded-lg shadow-md overflow-hidden">
      {/* Title Input */}
      <div className="p-6 border-b border-gray-200">
        <input
          onBlur={() => onSave("title", title)}
          type="text"
          placeholder="Enter page title..."
          value={title}
          onChange={handleTitleChange}
          className="w-full text-2xl font-semibold outline-none placeholder-gray-400"
        />
      </div>

      {/* Editor Component */}
      <div className="p-6">
        <Editor existingContent={content} callback={handleContentChange} />
      </div>
    </div>
  );
};

export default EditorWrapper;
