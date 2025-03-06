import React, { useState, useRef, useEffect } from "react";
import { FiDroplet, FiX } from "react-icons/fi";

import ColorPicker from "./ColorPicker";

const Colors = ({ execCommand }) => {
  const [textColor, setTextColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorButtonRef = useRef(null);
  const colorPickerRef = useRef(null);

  const changeTextColor = (color) => {
    setTextColor(color.hex);
    execCommand("foreColor", color.hex);
    setShowColorPicker(false);
  };

  const handleColorButtonClick = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
    setShowColorPicker(!isColorPickerOpen);
  };

  const handleClearColor = (e) => {
    e.stopPropagation(); // Prevent triggering the color picker
    changeTextColor("");
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target) &&
        !colorButtonRef.current.contains(event.target)
      ) {
        setIsColorPickerOpen(false);
        setShowColorPicker(false);
      }
    };

    if (isColorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColorPickerOpen, setShowColorPicker]);

  return (
    <div className="relative inline-block">
      {/* Color Button */}
      <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
        <button
          ref={colorButtonRef}
          onClick={handleColorButtonClick}
          className={`
            p-2 rounded-md transition-all duration-200 ease-in-out
            ${textColor ? "text-white" : "hover:bg-gray-100"}
            relative
          `}
          style={{ background: textColor }}
          title="Text Color"
        >
          <FiDroplet size={16} />

          {/* Clear button that appears when color is selected */}
          {textColor && (
            <button
              onClick={handleClearColor}
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-all"
              title="Clear color"
            >
              <FiX size={12} className="text-gray-700" />
            </button>
          )}
        </button>
      </div>

      {/* Color Picker Popover */}
      {isColorPickerOpen && (
        <div ref={colorPickerRef} className="absolute top-44">
          {/* Color Picker Component */}
          <ColorPicker
            color={textColor}
            onChange={changeTextColor}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
          />
        </div>
      )}
    </div>
  );
};

export default Colors;
