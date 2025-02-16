// Sidebar.js
import React, { useState } from "react";
import { FaBook, FaSearch } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";

import CreateBook from "../Books/CreateBook";
import { useBookCtx } from "../../Contexts/BookCtx";
import Books from "../Books/Books";
import CreateShelf from "../Shelf/CreateShelf";
import Shelf from "../Shelf/Shelf";

const Sidebar = () => {
  const { books, shelves, SetContentOnMainPage } = useBookCtx();
  const [selectedBook, setSelectedBook] = useState(undefined);

  const setWhatToLoadOnMainPage = (config) => {
    SetContentOnMainPage(config);
  };

  return (
    <div className="relative z-10 w-72 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-indigo-600">
            <rect
              x="10"
              y="70"
              width="80"
              height="10"
              className="fill-current"
            />
            <rect
              x="15"
              y="30"
              width="10"
              height="40"
              className="fill-current opacity-50"
            />
            <rect
              x="30"
              y="20"
              width="10"
              height="50"
              className="fill-current opacity-70"
            />
            <rect
              x="45"
              y="40"
              width="10"
              height="30"
              className="fill-current opacity-50"
            />
            <rect
              x="60"
              y="10"
              width="10"
              height="60"
              className="fill-current opacity-70"
            />
            <rect
              x="75"
              y="50"
              width="10"
              height="20"
              className="fill-current opacity-50"
            />
          </svg>
          <h1 className="text-xl font-bold text-gray-800">shelf.io</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books and pages..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <CreateBook />

        {/* Books List */}
        <div className="space-y-4">
          {/* Shelved Books */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <GiBookshelf size={16} />
                <span>Shelves</span>
              </div>
              <CreateShelf />
            </div>

            {shelves &&
              shelves.map((shelf) => (
                <Shelf
                  onClick={setWhatToLoadOnMainPage}
                  shelf_data={shelf}
                  selectedBook={selectedBook}
                  setSelectedBook={setSelectedBook}
                />
              ))}
          </div>

          {/* Unshelved Books */}
          <div>
            <div className="flex items-center gap-2 px-2 mb-3 text-sm font-medium text-gray-600">
              <FaBook size={16} />
              <span>Unshelved Books</span>
            </div>
            <div className="pl-4 space-y-1">
              {books &&
                books.map((book) => (
                  <Books
                    onClick={() => {
                      setWhatToLoadOnMainPage({
                        config: book,
                        type: "unShelvedBook",
                      });
                      setSelectedBook({ id: book.id, name: book.title });
                    }}
                    key={book.id}
                    bookData={book}
                    selectedBook={selectedBook}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
