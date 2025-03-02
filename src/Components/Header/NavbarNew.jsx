import React from "react";
import { useParams } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

import { useAuthCtx } from "../../Contexts/AuthCtx";
import CreateNote from "../Notes/CreateNote";
import { useBookCtx } from "../../Contexts/BookCtx";
import CreateBook from "../Books/CreateBook";
import Settings from "../Setting/Settings";

const getPluralOrSingular = (word, length) => {
  let convertedWord;

  if (length === 1) {
    convertedWord = word;
  } else {
    convertedWord = word + "s";
  }

  return convertedWord;
};

const NavbarNew = ({ navAddress = [], noLineClamp = false }) => {
  const { logoutHandler } = useAuthCtx();
  const { books, pages, shelves } = useBookCtx();
  const { parentType, parentId, parentName, child1Type, child1Id, child1Name } =
    useParams();

  let bookId;
  let shelfId;
  let shelfName;
  let bookName;
  let booksCount;

  if (child1Type === "book") {
    booksCount = pages?.length
      ? pages.length + getPluralOrSingular(" page", pages.length)
      : "";
  } else if (parentType === "book") {
    booksCount = pages?.length
      ? pages.length + getPluralOrSingular(" page", pages.length)
      : "";
  } else if (parentType === "shelf") {
    booksCount = books?.length
      ? books.length + getPluralOrSingular(" book", books.length)
      : "";
  }

  if (parentType === "shelf") {
    shelfId = parentId;
    bookId = child1Id;
    shelfName = parentName;
    bookName = child1Name;
  } else {
    bookId = parentId;
    bookName = parentName;
  }

  const selectedShelfDetails = shelves?.find((shelf) => shelf.id === shelfId);

  return (
    <div className="z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 cursor-default">
        {navAddress.map((address, i) => (
          <React.Fragment key={address + i}>
            <span
              className={
                (navAddress.length === i + 1
                  ? "text-lg font-semibold text-gray-800  "
                  : "text-sm text-gray-500") +
                (noLineClamp ? " " : " line-clamp-1  max-w-56")
              }
            >
              {address}
            </span>
            {navAddress.length !== i + 1 && (
              <FaChevronRight size={16} className="text-gray-400" />
            )}
          </React.Fragment>
        ))}

        {/* <span className="text-sm text-gray-500">12 pages</span> */}
      </div>

      <div className="flex items-center gap-3 ">
        <p className="text-gray-600">{booksCount}</p>

        {bookId && (
          <>
            <CreateNote
              shelfName={shelfName}
              bookName={bookName}
              bookId={bookId}
              shelfId={shelfId}
              isTextBtn={true}
            />
          </>
        )}

        {selectedShelfDetails && !bookId && (
          <div className="w-fit">
            <CreateBook
              shelf={{
                id: shelfId,
                name: selectedShelfDetails?.name,
                icon: selectedShelfDetails?.icon,
              }}
              isTextBtn={true}
            />
          </div>
        )}

        {parentId && <Settings />}

        <button
          onClick={logoutHandler}
          className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg`}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default NavbarNew;
