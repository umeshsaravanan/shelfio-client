import { MdPalette } from "react-icons/md";
import React from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({
  color,
  onChange,
  showColorPicker,
  setShowColorPicker,
}) => {
  return (
    <div className="flex items-center gap-1" title="Text Color">
      <MdPalette size={16} className="text-gray-500" />
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="toolbar-btn"
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            backgroundColor: color,
            border: "1px solid #ccc",
          }}
        ></div>
      </button>
      {showColorPicker && (
        <div className="absolute z-10 mt-8">
          <SketchPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
