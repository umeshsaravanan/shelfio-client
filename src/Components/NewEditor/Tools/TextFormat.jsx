import React from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdHighlight,
} from "react-icons/md"; // Material Design Icons

const TextFormat = ({
  isBold,
  toggleBold,
  isItalic,
  toggleItalic,
  isUnderline,
  toggleUnderline,
  isHighlighted,
  toggleHighlight,
}) => {
  const formattingOptions = [
    {
      icon: MdFormatBold, // Use MdFormatBold
      isActive: isBold,
      onClick: toggleBold,
      title: "Bold",
    },
    {
      icon: MdFormatItalic, // Use MdFormatItalic
      isActive: isItalic,
      onClick: toggleItalic,
      title: "Italic",
    },
    {
      icon: MdFormatUnderlined, // Use MdFormatUnderlined
      isActive: isUnderline,
      onClick: toggleUnderline,
      title: "Underline",
    },
    {
      icon: MdHighlight, // Use MdHighlight
      isActive: isHighlighted,
      onClick: toggleHighlight,
      title: "Highlight",
    },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
      {formattingOptions.map((option, index) => (
        <button
          key={index}
          onClick={option.onClick}
          title={option.title}
          className={`
            p-2 rounded-md transition-all duration-200 ease-in-out
            ${option.isActive ? "bg-indigo-500 text-white" : ""}
            hover:bg-indigo-400 hover:text-white
          `}
        >
          <option.icon size={16} />
        </button>
      ))}
    </div>
  );
};

export default TextFormat;
