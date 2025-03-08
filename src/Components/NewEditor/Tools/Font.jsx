import React, { useMemo } from "react";
import { MdTitle, MdKeyboardArrowDown, MdTextFields } from "react-icons/md";

const Font = ({
  fontFamily,
  changeFontFamily,
  fontSize,
  changeFontSize,
  changeHeading,
}) => {
  // Font configuration
  const fontFamilies = [
    // Sans-serif fonts
    { value: "Arial", label: "Arial", sample: "Aa", category: "Sans-serif" },
    {
      value: "Verdana",
      label: "Verdana",
      sample: "Aa",
      category: "Sans-serif",
    },
    {
      value: "Helvetica",
      label: "Helvetica",
      sample: "Aa",
      category: "Sans-serif",
    },

    // Serif fonts
    {
      value: "Times New Roman",
      label: "Times New Roman",
      sample: "Aa",
      category: "Serif",
    },
    { value: "Georgia", label: "Georgia", sample: "Aa", category: "Serif" },
    { value: "Garamond", label: "Garamond", sample: "Aa", category: "Serif" },

    // Monospace fonts
    {
      value: "Courier New",
      label: "Courier New",
      sample: "Aa",
      category: "Monospace",
    },
    {
      value: "Consolas",
      label: "Consolas",
      sample: "Aa",
      category: "Monospace",
    },
    { value: "Monaco", label: "Monaco", sample: "Aa", category: "Monospace" },

    // Fantasy fonts
    { value: "Papyrus", label: "Papyrus", sample: "Aa", category: "Fantasy" },
    { value: "Impact", label: "Impact", sample: "Aa", category: "Fantasy" },

    // Cursive fonts
    {
      value: "Brush Script MT",
      label: "Brush Script",
      sample: "Aa",
      category: "Cursive",
    },
    { value: "Lobster", label: "Lobster", sample: "Aa", category: "Cursive" },
  ];

  const fontSizes = useMemo(
    () =>
      Array.from({ length: (96 - 12) / 2 + 1 }, (_, i) => {
        const size = 12 + i * 2;
        return { value: `${size}px`, label: `${size}` };
      }),
    []
  );

  // Headings configuration
  const headingOptions = [
    {
      value: "p",
      label: "Normal",
      icon: MdTextFields, // Use MdTextFields for normal text
      className: "text-gray-600",
    },
    {
      value: "h1",
      label: "Heading 1",
      icon: MdTitle, // Use MdTitle for headings
      className: "text-blue-600 font-bold",
    },
    {
      value: "h2",
      label: "Heading 2",
      icon: MdTitle, // Use MdTitle for headings
      className: "text-green-600 font-semibold",
    },
    {
      value: "h3",
      label: "Heading 3",
      icon: MdTitle, // Use MdTitle for headings
      className: "text-purple-600 font-medium",
    },
  ];

  return (
    <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
      {/* Font Family Dropdown */}
      <div className="relative">
        <select
          value={fontFamily}
          onChange={(e) => changeFontFamily(e.target.value)}
          className="
            appearance-none
            bg-white
            border 
            border-gray-300 
            rounded-md 
            pl-3 
            pr-8 
            py-1.5 
            text-sm 
            text-gray-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-300 
            cursor-pointer
            w-28
          "
          title="Font Family"
        >
          {fontFamilies.map((font) => (
            <option
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <MdKeyboardArrowDown size={16} /> {/* Use FiChevronDown */}
        </div>
      </div>

      {/* Font Size Dropdown */}
      <div className="relative">
        <select
          value={fontSize}
          onChange={(e) => changeFontSize(e.target.value)}
          className="
            appearance-none
            bg-white
            border 
            border-gray-300 
            rounded-md 
            pl-3 
            pr-8 
            py-1.5 
            text-sm 
            text-gray-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-300 
            cursor-pointer
            w-16
          "
          title="Font Size"
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <MdKeyboardArrowDown size={16} /> {/* Use FiChevronDown */}
        </div>
      </div>

      {/* Headings Dropdown */}
      <div className="relative">
        <select
          onChange={(e) => changeHeading(e.target.value)}
          className="
            appearance-none
            bg-white
            border 
            border-gray-300 
            rounded-md 
            pl-3 
            pr-8 
            py-1.5 
            text-sm 
            text-gray-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-300 
            cursor-pointer
            w-28
          "
          title="Headings"
        >
          {headingOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className={option.className}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <MdKeyboardArrowDown size={16} /> {/* Use FiChevronDown */}
        </div>
      </div>
    </div>
  );
};

export default Font;
