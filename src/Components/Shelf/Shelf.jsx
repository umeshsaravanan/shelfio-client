import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Books from "../Books/Books";
import { useNavigate, useParams } from "react-router-dom";

const Shelf = ({ shelf_data, selectedBook, setSelectedBook, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, books } = shelf_data;
  const navigate = useNavigate();
  const { parentId, parentType } = useParams();

  const chevronOnclickHandler = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const onClickHandler = (shelf, book) => {
    let link = `/shelf/${shelf.name}/${shelf.id}`;

    if (book) {
      link += `/book/${book.title}/${book.id}`;
    }

    navigate(link);
  };

  let shelfId;

  if (parentType === "shelf") {
    shelfId = parentId;
  }

  useEffect(() => {
    if (shelf_data?.id === shelfId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    //eslint-disable-next-line
  }, [shelfId]);

  return (
    <div className="mb-3">
      <button
        onClick={() => onClickHandler(shelf_data)}
        className={`w-full flex items-center text-left px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
          shelf_data?.id === shelfId
            ? " text-indigo-600 bg-indigo-50  "
            : " hover:bg-gray-50"
        }`}
      >
        <div onClick={chevronOnclickHandler}>
          {isOpen ? (
            <FaChevronDown size={16} className="mr-2" />
          ) : (
            <FaChevronRight size={16} className="mr-2" />
          )}
        </div>

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
                  key={book.id}
                  selectedBook={selectedBook}
                  bookData={book}
                  onClick={() => {
                    onClickHandler(shelf_data, book);
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
