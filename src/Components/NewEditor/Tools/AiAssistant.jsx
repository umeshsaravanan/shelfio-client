import React from "react";

const AIAssistantButton = () => {
  return (
    <div className="relative inline-flex items-center">
      <button
        className="
          flex items-center 
          gap-2 
          px-3 
          py-2 
          bg-gradient-to-r from-blue-500 to-purple-600 
          opacity-50
          text-white 
          rounded-md 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-300
          transition-all
          duration-200
          shadow-md
        "
        disabled
        title="AI Assistant - Coming Soon"
      >
        <ImprovedAIIcon />
        <span className="text-sm font-medium">AI</span>
      </button>

      {/* Coming Soon Badge */}
      {/* <div className="absolute -top-3 -left-2 bg-amber-500 text-white text-xs  px-2 py-1 rounded-full shadow-md">
        Coming Soon
      </div> */}
    </div>
  );
};

// Improved AI Icon component
const ImprovedAIIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    {/* Background subtle glow */}
    <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.08)" />

    {/* Main brain outline */}
    <path
      d="M12 21.5C12 21.5 19 17.5 19 12V6.5C17.5 5 14.5 4 12 4C9.5 4 6.5 5 5 6.5V12C5 17.5 12 21.5 12 21.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(255,255,255,0.1)"
    />

    {/* Neural network connections */}
    <path
      d="M9 12C9 12 10 14 12 14C14 14 15 12 15 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M8 9C8 9 9.5 10 12 10C14.5 10 16 9 16 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Neural nodes */}
    <circle cx="7.5" cy="9" r="1" fill="currentColor" />
    <circle cx="16.5" cy="9" r="1" fill="currentColor" />
    <circle cx="8.5" cy="12" r="1" fill="currentColor" />
    <circle cx="15.5" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />

    {/* Pulse effect */}
    <circle cx="12" cy="10" r="1.5" fill="white">
      <animate
        attributeName="opacity"
        from="0.8"
        to="0.2"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Data flow lines */}
    <path
      d="M12 7L12 17"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeDasharray="1 2"
    />

    <path
      d="M7.5 9L16.5 9"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeDasharray="1 2"
    />

    <path
      d="M8.5 12L15.5 12"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeDasharray="1 2"
    />
  </svg>
);

export default AIAssistantButton;
