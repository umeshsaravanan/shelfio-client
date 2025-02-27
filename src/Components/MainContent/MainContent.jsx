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
  const { showOverlayLoading } = useBookCtx();

  const {
    parentType,
    parentName,
    parentId,
    child1Type,
    child1Name,
    child1Id,
    child2Name,
  } = useParams();

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
    let link = [parentName];

    if (child1Name) {
      link.push(child1Name);
    }

    if (child2Name) {
      link.push(child2Name);
    }

    setNavAddress(link);
  }, [parentName, child1Name, child2Name]);

  return (
    <div className="relative z-10 flex-1 flex flex-col">
      <NavbarNew navAddress={navAddress} />

      <div className="h-full overflow-auto">{body}</div>

      {showOverlayLoading && <ShelfLoader />}
    </div>
  );
};

export default MainContent;
