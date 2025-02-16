import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const Dropdown = ({ defaultText, options, value, handleChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getIcon = ({ icon: Icon, color }) => {
    return <Icon className={`w-4 h-4 ${color}`} />;
  };

  const getSelectedOption = (option) => {
    let selectedDisplay;

    if (option.icon) {
      selectedDisplay = (
        <>
          <span>
            {option?.icon &&
              getIcon({ icon: option.icon.icon, color: option.icon.color })}
          </span>
          <span> {option?.name}</span>
        </>
      );
    } else {
      selectedDisplay = <span> {option.name || defaultText}</span>;
    }

    return selectedDisplay;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
      >
        <div
          className="flex items-center space-x-3 px-4 py-2 cursor-pointer
        hover:bg-gray-50 transition-colors duration-200"
        >
          {getSelectedOption(value)}
        </div>

        {/* Dynamic Arrow Icon */}
        {isDropdownOpen ? (
          <FaChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
        ) : (
          <FaChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200">
          <ul className="py-2">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  handleChange(option);
                  setIsDropdownOpen(false); // Close dropdown after selection
                }}
                className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <span>{option?.icon && getIcon(option.icon)}</span>
                <span> {option.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
