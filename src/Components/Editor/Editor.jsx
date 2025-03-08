import React, { useState, useEffect } from "react";
import Prism from "prismjs";

import "./Editor.css";
import "prismjs/themes/prism.css"; // Default theme
import RichTextEditor from "../NewEditor/RichTextEditor";

const Editor = ({ existingContent, callback }) => {
  const [content, setContent] = useState(existingContent);

  useEffect(() => {
    setContent(existingContent);
  }, [existingContent]);

  const onBlurHandler = (content) => {
    callback("content", content);
    setContent(content);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="editor-container h-full">
      <RichTextEditor handleBlur={onBlurHandler} value={content} />
    </div>
  );
};

export default Editor;
