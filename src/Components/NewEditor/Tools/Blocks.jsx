import React, { useRef, useState, useEffect } from "react";
import { MdFunctions, MdKeyboardArrowDown } from "react-icons/md";
import {
  FaListUl,
  FaListOl,
  FaCheckSquare,
  FaImage,
  FaCode,
  FaPaperclip,
  FaLink,
  FaMinus,
  FaQuoteRight,
  FaTimes,
} from "react-icons/fa"; // Import Font Awesome icons
import TableTool from "./Table";

const Blocks = ({
  insertList,
  insertCheckboxList,
  insertCodeBlock,
  insertAttachment,
  insertLink,
  insertDivider,
  insertQuote,
  insertFormula,
  editorRef,
}) => {
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFileSelect = (event) => {
    insertAttachment(event.target.files);
    setIsOpen(false);
  };

  // Dropdown item configuration with colors and descriptions
  const dropdownItems = [
    {
      icon: FaListUl,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      label: "Bullet List",
      onClick: () => insertList("unordered"),
      description: "Create a simple bullet list",
    },
    {
      icon: FaListOl,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      label: "Numbered List",
      onClick: () => insertList("ordered"),
      description: "Create a numbered list",
    },
    {
      icon: FaCheckSquare,
      color: "text-green-500",
      bgColor: "bg-green-100",
      label: "Checkbox List",
      onClick: insertCheckboxList,
      description: "Create a list with checkboxes",
    },
    {
      icon: FaImage,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      label: "Insert Image",
      onClick: () => fileInputRef.current.click(),
      description: "Upload or embed an image",
    },
    {
      icon: FaCode,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      label: "Insert Code Block",
      onClick: insertCodeBlock,
      description: "Add a code snippet",
    },
    {
      icon: FaPaperclip,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      label: "Attach File",
      onClick: () => fileInputRef.current.click(),
      description: "Attach files to your document",
    },
    {
      icon: FaLink,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      label: "Insert Link",
      onClick: insertLink,
      description: "Add a hyperlink",
    },
    {
      icon: FaMinus,
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      label: "Insert Divider",
      onClick: insertDivider,
      description: "Add a horizontal line",
    },
    {
      icon: FaQuoteRight,
      color: "text-teal-500",
      bgColor: "bg-teal-100",
      label: "Insert Quote",
      onClick: insertQuote,
      description: "Add a quotation",
    },
    {
      icon: MdFunctions,
      color: "text-red-500",
      bgColor: "bg-red-100",
      label: "Insert Formula",
      onClick: insertFormula,
      description: "Add a mathematical formula",
    },
  ];

  // Filter items based on search
  const filteredItems = dropdownItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Dropdown Button with icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <div className="flex items-center">
          <span className="text-sm text-gray-700">Blocks</span>
        </div>
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

      {/* Dropdown Menu with improved styling */}
      {isOpen && (
        <div className="absolute left-0 top-10 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <TableTool editorRef={editorRef} />
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group border border-gray-100 hover:border-gray-200"
                  >
                    <div
                      className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon size={20} className={item.color} />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-800">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No blocks found. Try a different search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default Blocks;
