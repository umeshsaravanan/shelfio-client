import React, { useEffect, useState } from "react";

import { useBookCtx } from "../../Contexts/BookCtx";
import NavbarNew from "../Header/NavbarNew";
import BooksOfShelf from "./BooksOfShelf";
import { useParams } from "react-router-dom";
import PagesOfBook from "./PagesOfBook";

export const MAIN_CONTENT_TYPE = {
  SHELF: 0,
  BOOK: 1,
};

const MainContent = () => {
  const { contentOnMainPage, getBooksOfShelf, getAllNotes } = useBookCtx();
  const [card, setCard] = useState([]); //eslint-disable-line
  const [page, setPage] = useState(null); //eslint-disable-line
  const [navAddress, setNavAddress] = useState([]);

  const {
    parentType,
    parentName,
    parentId,
    child1Type,
    child1Name,
    child1Id,
    child2Name,
  } = useParams();

  let navigationLinks = [];

  if (contentOnMainPage) {
    if (contentOnMainPage.type === "shelf" && contentOnMainPage.config.name) {
      navigationLinks = [contentOnMainPage.config.name];
    } else if (contentOnMainPage.type === "book") {
      navigationLinks.push(contentOnMainPage.shelf.name);
      navigationLinks.push(contentOnMainPage.config.title);
    } else if (contentOnMainPage.type === "unShelvedBook") {
      navigationLinks.push(contentOnMainPage.config.title);
    }
  }

  const getBooks = async (id) => {
    const data = await getBooksOfShelf(id);

    let cardData = [];

    if (data && data.length) {
      data.forEach((book) => {
        cardData.push({
          title: book?.title,
          description: book?.description,
          updatedDate: book.updated_at,
          allData: book,
          type: "book",
          shelf: book?.shelf,
        });
      });
    }

    setCard(cardData);
  };

  const updateCard = (pages) => {
    let cardData = [];

    if (pages && pages.length) {
      pages.forEach((book) => {
        cardData.push({
          title: book?.title,
          description: book?.description,
          updatedDate: book.updated_at,
          allData: book,
          type: "page",
          shelf: book?.shelf,
        });
      });

      const selectedPage = pages?.[0];

      setPage(selectedPage);
    }

    setCard(cardData);
  };

  const getPagesOfBook = async (id) => {
    await getAllNotes(id, updateCard);
  };

  useEffect(() => {
    if (contentOnMainPage) {
      if (contentOnMainPage.type === "shelf") {
        getBooks(contentOnMainPage.config.id);
      } else {
        getPagesOfBook(contentOnMainPage.config.id);
      }
    }

    // Reset active page when contentOnMainPage changes
    setPage(null);

    //eslint-disable-next-line
  }, [contentOnMainPage]);

  // const onClickHandler = (clickedData, type, shelf) => {
  //   if (type === "page") {
  //     setPage(clickedData); // Set the active page
  //   } else {
  //     SetContentOnMainPage({ config: clickedData, type, shelf });
  //   }
  // };

  // const onSaveHandler = (type, value) => {
  //   const updatedPage = { ...page, [type]: value };
  //   setPage(updatedPage);
  //   updateNote(updatedPage);
  // };

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

      <div className="h-full p-6 overflow-auto">{body}</div>
    </div>
  );
};

export default MainContent;
