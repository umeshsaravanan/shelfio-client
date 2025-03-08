import React, { useEffect, useRef, useState } from "react";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdChevronRight,
  MdChevronLeft,
  MdKeyboardArrowDown,
  MdStrikethroughS,
} from "react-icons/md"; // Material Design Icons
import { TbSuperscript } from "react-icons/tb";
import { TbSubscript } from "react-icons/tb";

const MoreTools = ({
  alignText,
  indentText,
  outdentText,
  formatText,
  activeFormats, // New prop to indicate active formatting options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom icons for superscript and subscript

  const paragraphOptions = [
    {
      type: "Left",
      icon: MdFormatAlignLeft, // Use MdFormatAlignLeft
      title: "Align Left",
      color: "text-blue-500",
      action: () => alignText("Left"),
    },
    {
      type: "Center",
      icon: MdFormatAlignCenter, // Use MdFormatAlignCenter
      title: "Align Center",
      color: "text-green-500",
      action: () => alignText("Center"),
    },
    {
      type: "Right",
      icon: MdFormatAlignRight, // Use MdFormatAlignRight
      title: "Align Right",
      color: "text-purple-500",
      action: () => alignText("Right"),
    },
    {
      type: "Indent",
      icon: MdChevronRight, // Use MdChevronRight
      title: "Indent",
      color: "text-orange-500",
      action: indentText,
    },
    {
      type: "Outdent",
      icon: MdChevronLeft, // Use MdChevronLeft
      title: "Outdent",
      color: "text-red-500",
      action: outdentText,
    },
  ];

  const textFormatOptions = [
    {
      type: "Strikethrough",
      icon: MdStrikethroughS, // Use MdStrikethroughS
      title: "Strikethrough",
      color: "text-pink-500",
      action: () => formatText("strikethrough"),
    },
    {
      type: "Superscript",
      icon: TbSuperscript, // Custom icon (unchanged)
      title: "Superscript",
      color: "text-indigo-500",
      action: () => formatText("superscript"),
    },
    {
      type: "Subscript",
      icon: TbSubscript, // Custom icon (unchanged)
      title: "Subscript",
      color: "text-teal-500",
      action: () => formatText("subscript"),
    },
  ];

  // Combine all options
  const allOptions = [...paragraphOptions, ...textFormatOptions];

  return (
    <div className="relative  items-center flex" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center 
          space-x-2 
          px-3 
          py-2 
          bg-white 
          border 
          border-gray-300 
          rounded-md 
          hover:bg-gray-50 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-300
        "
      >
        <span className="text-sm text-gray-700">More</span>
        <MdKeyboardArrowDown
          size={16}
          className={`
            text-gray-500 
            transition-transform 
            duration-200 
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
          absolute 
          right-0 
          top-10
          mt-2 
          w-48 
          bg-white 
          border 
          border-gray-300 
          rounded-md 
          shadow-lg 
          z-10
          overflow-hidden
        "
        >
          {allOptions.map((option, index) => (
            <React.Fragment key={option.type}>
              {/* Add separator before text format options */}
              {index === paragraphOptions.length && (
                <div className="border-t border-gray-200 my-1"></div>
              )}
              <button
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className={`
                  w-full 
                  flex 
                  items-center 
                  px-3 
                  py-2 
                  text-left 
                  transition-colors 
                  duration-200
                  ${
                    activeFormats.includes(option.type.toLowerCase())
                      ? "bg-indigo-500 text-white hover:bg-indigo-300"
                      : ""
                  }
                `}
              >
                {React.createElement(option.icon, {
                  size: 16,
                  className: `${
                    activeFormats.includes(option.type.toLowerCase())
                      ? "text-white"
                      : option.color
                  } mr-3`,
                })}
                <span className="text-sm">{option.title}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreTools;
