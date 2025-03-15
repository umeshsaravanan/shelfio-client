import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";

import CreateBook from "../Books/CreateBook";
import { useBookCtx } from "../../Contexts/BookCtx";
import Books from "../Books/Books";
import CreateShelf from "../Shelf/CreateShelf";
import Shelf from "../Shelf/Shelf";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import UpComingFeatures from "./UpComingFeatures";

const Sidebar = () => {
  const { unShelvedBooks, shelves } = useBookCtx();
  const [selectedBook, setSelectedBook] = useState(undefined);
  const navigate = useNavigate();
  const { parentType, parentId, child1Id } = useParams();

  const onClickHandler = (book) => {
    const link = `/book/${book.title}/${book.id}`;

    navigate(link);
  };

  useEffect(() => {
    if (parentType === "shelf") {
      setSelectedBook({ id: child1Id });
    } else if (parentType === "book") {
      setSelectedBook({ id: parentId });
    }
  }, [parentType, child1Id, parentId]);

  const handleLogoClick = () => {
    setSelectedBook(null);
    navigate("/");
  };

  return (
    <div className="relative z-10 w-72 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg">
      <div className="p-6">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 mb-8 cursor-pointer"
        >
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
          <h1 className="text-xl font-bold text-gray-800">Shelfbook</h1>
        </div>

        {/* Search */}
        <SearchBar />

        <CreateBook />

        {/* Books List */}
        <div className="space-y-4 h-[calc(100%-190px)] overflow-auto pr-2">
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
                  key={shelf.id}
                  shelf_data={shelf}
                  selectedBook={selectedBook}
                  setSelectedBook={setSelectedBook}
                />
              ))}
          </div>

          {/* Unshelved Books */}
          {unShelvedBooks.length ? (
            <div>
              <div className="flex items-center gap-2 px-2 mb-3 text-sm font-medium text-gray-600">
                <FaBook size={16} />
                <span>Unshelved Books</span>
              </div>
              <div className="pl-4 space-y-1">
                {unShelvedBooks.map((book) => (
                  <Books
                    onClick={() => onClickHandler(book)}
                    key={book.id}
                    bookData={book}
                    selectedBook={selectedBook}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <UpComingFeatures />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
