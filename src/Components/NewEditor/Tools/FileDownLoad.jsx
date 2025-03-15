import React from "react";
import { IoMdDownload } from "react-icons/io";
import { jsPDF } from "jspdf";

const FileDownLoad = ({ editorRef }) => {
  const downloadPdf = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    const doc = new jsPDF("p", "mm", "a4");
    doc.html(content, {
      callback: function (doc) {
        doc.save("document.pdf");
      },
      margin: [10, 10, 10, 10],
      autoPaging: "text",
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 675,
    });
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
      <button
        title="Download"
        className={` p-2 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-200`}
        onClick={downloadPdf}
      >
        <IoMdDownload size={16} />
      </button>
    </div>
  );
};

export default FileDownLoad;
