import React, { useEffect, useState } from "react";

import { useBookCtx } from "../../Contexts/BookCtx";
import NavbarNew from "../Header/NavbarNew";
import BooksOfShelf from "./BooksOfShelf";
import { useParams } from "react-router-dom";
import PagesOfBook from "./PagesOfBook";
import ShelfLoader from "../Loader/ShelfLoader";

export const MAIN_CONTENT_TYPE = {
  SHELF: 0,
  BOOK: 1,
};

const MainContent = () => {
  const [navAddress, setNavAddress] = useState([]);
  const { showOverlayLoading, pages, shelves, unShelvedBooks } = useBookCtx();

  const { parentType, parentId, child1Type, child1Id, child2Id } = useParams();

  const type = child1Type || parentType;
  const id = child1Id || parentId;

  let body;

  switch (type) {
    case "shelf":
      body = <BooksOfShelf shelfId={id} />;
      break;

    case "book":
      body = <PagesOfBook bookId={id} />;
      break;

    default:
      body = null;
      break;
  }

  useEffect(() => {
    const link = [];

    const findItemById = (items, id) => items?.find((item) => item.id === id);

    if (parentType === "shelf") {
      const shelf = findItemById(shelves, parentId);
      if (shelf) {
        link.push(shelf.name);
        const book = findItemById(shelf.books, child1Id);
        if (book) link.push(book.title);

        const page = findItemById(pages, child2Id);
        if (page) link.push(page.title);
      }
    } else if (parentType === "book") {
      const book = findItemById(unShelvedBooks, parentId);
      if (book) link.push(book.title);

      const page = findItemById(pages, child1Id);
      if (page) link.push(page.title);
    }

    setNavAddress(link);
  }, [
    parentType,
    parentId,
    child1Id,
    child2Id,
    pages,
    shelves,
    unShelvedBooks,
  ]);

  return (
    <div className="relative z-10 flex-1 flex flex-col">
      <NavbarNew navAddress={navAddress} />

      <div className="h-full overflow-auto">{body}</div>

      {showOverlayLoading && <ShelfLoader />}
    </div>
  );
};

export default MainContent;
