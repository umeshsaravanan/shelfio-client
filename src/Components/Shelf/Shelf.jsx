import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Books from "../Books/Books";

const Shelf = ({ shelf_data, selectedBook, setSelectedBook }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, books } = shelf_data;

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center text-left px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {isOpen ? (
          <FaChevronDown size={16} className="mr-2" />
        ) : (
          <FaChevronRight size={16} className="mr-2" />
        )}
        <span className="flex-1">{name}</span>
        <span className="text-xs text-gray-500">
          {shelf_data.books.length + " books"}
        </span>
      </button>

      {isOpen && (
        <div className="pl-6 mt-1 space-y-1">
          {books.length
            ? books.map((book) => (
                <Books
                  selectedBook={selectedBook}
                  bookData={book}
                  onClick={() => {
                    setSelectedBook({ id: book.id, name: book.title });
                  }}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default Shelf;
