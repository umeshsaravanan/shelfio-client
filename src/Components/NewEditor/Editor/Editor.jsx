import React from "react";

const Editor = ({ editorRef, handleBlur, value = "" }) => {
  return (
    <div
      ref={editorRef}
      contentEditable
      onBlur={handleBlur} // Attach the onBlur event handler
      dangerouslySetInnerHTML={{ __html: value }}
      className="editor p-4  overflow-y-auto overflow-x-hidden h-[69vh] rounded-b-lg outline-none"
    ></div>
  );
};

export default Editor;
