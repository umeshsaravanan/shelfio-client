import React, { useEffect, useState } from "react";

import { useBookCtx } from "../../Contexts/BookCtx";
import NavbarNew from "../Header/NavbarNew";
import Card from "../Card/Card";

const MainContent = () => {
  const { contentOnMainPage, getBooksOfShelf } = useBookCtx();
  const [card, setCard] = useState();

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
        });
      });
    }

    setCard(cardData);
  };

  useEffect(() => {
    if (contentOnMainPage && contentOnMainPage.type === "shelf") {
      getBooks(contentOnMainPage.config.id);
    }

    //eslint-disable-next-line
  }, [contentOnMainPage]);

  return (
    <div className="relative z-10 flex-1 flex flex-col">
      <NavbarNew navAddress={navigationLinks} />

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentOnMainPage &&
            card &&
            card.length &&
            card.map((eachCard) => (
              <Card
                title={eachCard.title}
                description={eachCard.description}
                updatedTime={eachCard.updatedDate}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
