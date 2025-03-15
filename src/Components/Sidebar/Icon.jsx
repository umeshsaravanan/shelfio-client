import React from "react";

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
    >
      <style>
        {`
          /* Pulse animation for circles */
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .pulse {
            animation: pulse 1.5s infinite;
          }

          /* Draw animation for lines */
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          .draw {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: draw 1.5s forwards;
          }
        `}
      </style>

      {/* Circles with pulse animation */}
      <circle cx="30" cy="30" r="5" fill="#0984E3" className="pulse" />
      <circle cx="70" cy="30" r="5" fill="#0984E3" className="pulse" />
      <circle cx="50" cy="50" r="5" fill="#00B894" className="pulse" />
      <circle cx="30" cy="70" r="5" fill="#0984E3" className="pulse" />
      <circle cx="70" cy="70" r="5" fill="#0984E3" className="pulse" />

      {/* Lines with draw animation */}
      <line
        x1="30"
        y1="30"
        x2="50"
        y2="50"
        stroke="#636E72"
        strokeWidth="2"
        className="draw"
      />
      <line
        x1="70"
        y1="30"
        x2="50"
        y2="50"
        stroke="#636E72"
        strokeWidth="2"
        className="draw"
      />
      <line
        x1="30"
        y1="70"
        x2="50"
        y2="50"
        stroke="#636E72"
        strokeWidth="2"
        className="draw"
      />
      <line
        x1="70"
        y1="70"
        x2="50"
        y2="50"
        stroke="#636E72"
        strokeWidth="2"
        className="draw"
      />
    </svg>
  );
};

export default Icon;
