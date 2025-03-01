import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
  FaBook,
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaFileAlt,
} from "react-icons/fa"; // Import FaEdit
import UserConfirmation from "../Popup/UserConfirmation";

const Card = ({
  title,
  updatedTime,
  description,
  extraText = "",
  onClick,
  isActive,
  onDelete,
  onEdit, // Add onEdit prop
  isEdit: isBook = true,
  showBookIcon = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dateTime = updatedTime ? moment.utc(updatedTime).fromNow() : undefined;
  const menuRef = useRef(null);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    onDelete();
    setIsConfirmOpen(false);
    setIsMenuOpen(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setIsConfirmOpen(false);
    setIsMenuOpen(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(); // Trigger the edit action
    setIsMenuOpen(false); // Close the dropdown
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className={`relative group bg-white/95 backdrop-blur-sm rounded-lg outline  p-4 hover:shadow-lg transition-shadow cursor-pointer ${
        isActive
          ? "outline-blue-600 shadow-lg"
          : "hover:outline-blue-600 outline-transparent shadow-lg"
      }`}
    >
      {/* Transparent Overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-black/5 rounded-lg pointer-events-none" />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2">
          {isBook || showBookIcon ? (
            <FaBook
              size={16}
              className={`${
                isActive ? "text-indigo-800" : "text-indigo-600"
              } shrink-0 mt-1`}
            />
          ) : (
            <FaFileAlt
              className={`${
                isActive ? "text-indigo-800" : "text-indigo-600"
              } shrink-0 mt-1`}
            />
          )}
          <div className="flex-1">
            <h3
              className={`font-medium line-clamp-1 ${
                isActive ? "text-indigo-900" : "text-gray-800"
              } mb-2`}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Kebab Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`p-1 ${
              isMenuOpen ? " " : " hidden "
            } group-hover:block hover:bg-gray-100 rounded-full`}
          >
            <FaEllipsisV size={16} className="text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {isBook ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                ) : null}

                {/* Delete Option */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {extraText && <p className="text-sm text-gray-600 mb-2">{extraText}</p>}
      <p className="text-sm text-gray-600 line-clamp-3 mb-2">
        {htmlToPlainText(description)}
      </p>
      <p className="text-xs  text-gray-600">{`updated ${dateTime}`}</p>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <UserConfirmation
          message={`Are you sure you want to delete <b>${title}</b> ?`}
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  );
};

export default Card;
function htmlToPlainText(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Replace <br> and block elements with new lines
  tempDiv.querySelectorAll("br").forEach((br) => (br.outerHTML = "\n"));
  tempDiv
    .querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6")
    .forEach((el) => {
      el.outerHTML = el.innerHTML + "\n";
    });

  return tempDiv.textContent
    ?.replace(/\n\s*\n/g, "\n") // Remove extra blank lines
    ?.replace(/\s+/g, " ") // Normalize spaces
    ?.trim();
}
