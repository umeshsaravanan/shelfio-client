import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { FaBook, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa"; // Import FaEdit
import UserConfirmation from "../Popup/UserConfirmation";

const Card = ({
  title,
  updatedTime,
  description,
  onClick,
  isActive,
  onDelete,
  onEdit, // Add onEdit prop
  isEdit = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dateTime = updatedTime ? moment(updatedTime).fromNow() : undefined;
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
      className={`relative group bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer ${
        isActive ? "border-indigo-600 shadow-lg" : "hover:border-indigo-300"
      }`}
    >
      {/* Transparent Overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaBook
            size={16}
            className={`${isActive ? "text-indigo-800" : "text-indigo-600"}`}
          />
          <h3
            className={`font-medium ${
              isActive ? "text-indigo-900" : "text-gray-800"
            } mb-2`}
          >
            {title}
          </h3>
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
                {isEdit ? (
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

      <p className="text-sm text-gray-600 mb-4">{`updated at ${dateTime}`}</p>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

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
