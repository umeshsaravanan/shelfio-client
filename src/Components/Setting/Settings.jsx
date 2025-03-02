import React, { useState, useRef, useEffect } from "react";
import { FaCog, FaEdit, FaTrash } from "react-icons/fa";
import CreateShelf from "../Shelf/CreateShelf";
import { useParams } from "react-router-dom";
import { useBookCtx } from "../../Contexts/BookCtx";
import CreateBook from "../Books/CreateBook";

const Settings = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editBook, setEditBook] = useState();
  const [isBook, setIsBook] = useState(false);

  const { parentType, parentId, child1Type, child1Id } = useParams();
  const { shelves, deleteShelf, books, unShelvedBooks } = useBookCtx();

  const menuRef = useRef(null);

  // Handle clicks outside the menu to close it
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  // Attach event listener for clicks outside the menu
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    // Handle edit action

    if (child1Type === "book" || parentType === "book") {
      setIsBook(true);

      let bookId;
      if (child1Type === "book") {
        bookId = child1Id;
      } else {
        bookId = parentId;
      }

      const selectedBook = [...(books || []), ...(unShelvedBooks || [])]?.find(
        (book) => book.id === bookId
      );

      if (!selectedBook) return;

      setEditBook(selectedBook);
    } else if (parentType === "shelf") {
      setIsBook(false);
      const shelf = shelves?.find((shelf) => shelf.id === parentId);
      if (!shelf) return;

      setEditBook({
        id: shelf.id,
        name: shelf.name,
        icon: shelf.icon,
        description: shelf.description,
      });
    }

    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (parentType === "shelf") {
      deleteShelf(parentId);
    }
    setIsMenuOpen(false);
  };

  let popup = null;

  if (editBook && isBook) {
    popup = (
      <CreateBook
        prefillData={editBook}
        onClose={() => setEditBook(undefined)}
      />
    );
  } else if (editBook) {
    popup = (
      <CreateShelf
        prefillShelf={editBook}
        onClose={() => setEditBook(undefined)}
      />
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <FaCog size={20} className="text-gray-600" />
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
            <button
              onClick={handleEdit}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
              role="menuitem"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>

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

      {popup}
    </div>
  );
};

export default Settings;
