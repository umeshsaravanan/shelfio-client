import React from "react";
import { FaCog, FaChevronRight } from "react-icons/fa";
import { useAuthCtx } from "../../Contexts/AuthCtx";
import CreateNote from "../Notes/CreateNote";
import { useParams } from "react-router-dom";
import { useBookCtx } from "../../Contexts/BookCtx";
import CreateBook from "../Books/CreateBook";

const NavbarNew = ({ navAddress = [] }) => {
  const { logoutHandler } = useAuthCtx();
  const { books, pages, shelves } = useBookCtx();
  const { parentType, parentId, child1Type, child1Id } = useParams();

  let bookId;
  let shelfId;
  let booksCount;

  if (child1Type === "book") {
    booksCount = pages?.length ? pages.length + " pages" : "";
  } else if (parentType === "book") {
    booksCount = pages?.length ? pages.length + " books" : "";
  } else if (parentType === "shelf") {
    booksCount = books?.length ? books.length + " books" : "";
  }

  if (parentType === "shelf") {
    shelfId = parentId;
    bookId = child1Id;
  } else {
    bookId = parentId;
  }

  const selectedShelfDetails = shelves?.find((shelf) => shelf.id === shelfId);

  return (
    <div className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 cursor-default">
        {navAddress.map((address, i) => (
          <React.Fragment key={address + i}>
            <span
              className={
                navAddress.length === i + 1
                  ? "text-lg font-semibold text-gray-800 max-w-56 line-clamp-1"
                  : "text-sm text-gray-500  max-w-56 line-clamp-1"
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
            <CreateNote bookId={bookId} shelfId={shelfId} isTextBtn={true} />
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

        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <FaCog size={20} className="text-gray-600" />
        </button>

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
