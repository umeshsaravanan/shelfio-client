import React, { useState, useRef, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import Prism from "prismjs";

import "./Editor.css";
import "prismjs/themes/prism.css"; // Default theme

const Editor = ({ existingContent, callback }) => {
  const [content, setContent] = useState(existingContent);

  useEffect(() => {
    setContent(existingContent);
  }, [existingContent]);

  const editor = useRef(null);

  const onBlurHandler = (content) => {
    callback("content", content);
    setContent(content);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const config = useMemo(() => {
    return {
      readonly: false,
      placeholder: "Start typing...",
      toolbarAdaptive: false,
      autoResize: false,
      statusbar: false,
      addNewLine: false,
      allowResizeY: false,
      allowResizeX: false,
      globalFullSize: true,
      autofocus: true,
      spellcheck: true,
      toolbarButtonSize: "small",
      defaultActionOnPaste: "insert_as_text",
      uploader: {
        insertImageAsBase64URI: true,
      },
      buttons:
        "bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,classSpan,image,spellcheck,cut,copy,paste",
      style: {
        // Customize the editor's appearance
        fontFamily: "Inter, sans-serif", // Match your app's font
        fontSize: "14px", // Match your app's font size
        color: "#1f2937", // Match your app's text color
        backgroundColor: "#ffffff", // Match your app's background color
      },
      controls: {
        // Customize toolbar buttons
        bold: {
          icon: "bold",
          tooltip: "Bold",
          css: {
            color: "#4f46e5", // Indigo color for buttons
          },
        },
        italic: {
          icon: "italic",
          tooltip: "Italic",
          css: {
            color: "#4f46e5", // Indigo color for buttons
          },
        },
        underline: {
          icon: "underline",
          tooltip: "Underline",
          css: {
            color: "#4f46e5", // Indigo color for buttons
          },
        },
        // Add more button customizations as needed
      },
      theme: "default", // Use the default theme for consistency
    };
  }, []);

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editor}
        value={content}
        autoResize={false}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => onBlurHandler(newContent)}
      />
    </div>
  );
};

export default Editor;
