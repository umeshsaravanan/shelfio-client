import React from "react";
import { FaCalendarAlt, FaTasks, FaProjectDiagram } from "react-icons/fa";
import { FaPuzzlePiece } from "react-icons/fa6";

const UpComingFeatures = () => {
  const productivityTools = [
    {
      id: "301",
      title: "Calendar",
      icon: <FaCalendarAlt size={16} />,
      selected: false,
    },
    { id: "302", title: "Tasks", icon: <FaTasks size={16} />, selected: false },
    {
      id: "303",
      title: "Mind Map",
      icon: <FaProjectDiagram size={16} />,
      selected: false,
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-2 mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 py-2 rounded-lg border border-dashed border-indigo-300">
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-700">
          <FaPuzzlePiece size={16} />
          <span className="font-semibold">Productivity Tools</span>
          {/* <span className="text-xs px-2 py-0.5 bg-indigo-500 text-white rounded-full">
        Coming Soon
      </span> */}
        </div>
        {/* <button className="text-indigo-500 hover:text-indigo-700 cursor-default">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button> */}
      </div>

      <div className="pl-4 space-y-2">
        {/* AI Agent - New Item */}
        <div
          key="ai-agent"
          className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg  transition relative overflow-hidden bg-gray-50 text-gray-500 cursor-default border border-gray-100"
        >
          <div className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="font-medium">AI Agent</span>
          <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-gray-100 to-transparent flex items-center justify-end pr-3">
            <span className="text-xs text-gray-400">Soon</span>
          </div>
        </div>

        {productivityTools.map((tool) => (
          <div
            key={tool.id}
            className={`flex items-center gap-3 px-4 cursor-default py-3 text-sm rounded-lg  transition relative overflow-hidden ${
              tool.selected
                ? "bg-indigo-100 text-indigo-600 border border-indigo-200"
                : "bg-gray-50 text-gray-500  border border-gray-100"
            }`}
          >
            <div
              className={`${
                tool.selected ? "text-indigo-500" : "text-gray-400"
              }`}
            >
              {tool.icon}
            </div>
            <span className="font-medium">{tool.title}</span>
            <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-gray-100 to-transparent flex items-center justify-end pr-3">
              <span className="text-xs text-gray-400">Soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpComingFeatures;
