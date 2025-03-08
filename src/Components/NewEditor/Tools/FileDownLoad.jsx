import React from "react";
import { IoMdDownload } from "react-icons/io";

const FileDownLoad = () => {
  return (
    <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
      <button
        title="Download - coming soon"
        className={` p-2 rounded-md transition-all duration-200 ease-in-out opacity-50 cursor-default`}
      >
        <IoMdDownload size={16} />
      </button>
    </div>
  );
};

export default FileDownLoad;
