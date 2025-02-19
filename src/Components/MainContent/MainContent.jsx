import React, { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useBookCtx } from "../../Contexts/BookCtx";
import NavbarNew from "../Header/NavbarNew";
import Card from "../Card/Card";
import CreateNote from "../Notes/CreateNote";
import EditorWrapper from "../Editor/EditorWrapper";

const MainContent = () => {
  const {
    contentOnMainPage,
    SetContentOnMainPage,
    getBooksOfShelf,
    getAllNotes,
    updateNote,
    allNotes,
  } = useBookCtx();
  const [card, setCard] = useState([]);
  const [page, setPage] = useState(null); // Track the active page

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

  const getPagesOfBook = async (id) => {
    await getAllNotes(id);
  };

  useEffect(() => {
    let cardData = [];

    if (allNotes && allNotes.length) {
      allNotes.forEach((book) => {
        cardData.push({
          title: book?.title,
          description: book?.description,
          updatedDate: book.updated_at,
          allData: book,
          type: "page",
          shelf: book?.shelf,
        });
      });

      const selectedPage = allNotes?.[0];

      setPage(selectedPage);

      setCard(cardData);
    }
  }, [allNotes]);

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

  const onClickHandler = (clickedData, type, shelf) => {
    if (type === "page") {
      setPage(clickedData); // Set the active page
    } else {
      SetContentOnMainPage({ config: clickedData, type, shelf });
    }
  };

  const onSaveHandler = (type, value) => {
    const updatedPage = { ...page, [type]: value };
    setPage(updatedPage);
    updateNote(updatedPage);
  };

  let body;

  if (contentOnMainPage?.type === "book") {
    // Single-row layout with editor
    body = (
      <div key={"tab2"} className="h-full flex transition-all duration-300">
        {/* Pages List (Left Side) */}
        <div className="w-1/4  p-4 overflow-y-auto border-r border-gray-200">
          <div className="flex flex-col space-y-4">
            {card.map((eachCard, i) => (
              <Card
                key={eachCard.title + i}
                title={eachCard.title}
                description={eachCard.description}
                updatedTime={eachCard.updatedDate}
                onClick={() =>
                  onClickHandler(
                    eachCard.allData,
                    eachCard.type,
                    eachCard.shelf
                  )
                }
                isActive={page?.id === eachCard.allData.id} // Highlight active page
              />
            ))}
          </div>
        </div>

        {/* Editor (Right Side) */}
        <div className="w-3/4 p-6">
          <EditorWrapper
            initialContent={page?.content}
            initialTitle={page?.title}
            onSave={onSaveHandler}
          />
        </div>
      </div>
    );
  } else {
    // Grid layout
    body = (
      <div key={"tab1 "}>
        {contentOnMainPage && card?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {card.map((eachCard, i) => (
              <Card
                key={eachCard.title + i}
                title={eachCard.title}
                description={eachCard.description}
                updatedTime={eachCard.updatedDate}
                isActive={page?.id === eachCard.allData.id}
                onClick={() =>
                  onClickHandler(
                    eachCard.allData,
                    eachCard.type,
                    eachCard.shelf
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-md space-y-4 p-6 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm text-center">
              <FaFileAlt size={64} className="text-indigo-500 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800">
                No Pages Yet
              </h3>
              <p className="text-sm text-gray-600">
                Start by creating your first page. Organize your notes, ideas,
                and thoughts in one place.
              </p>

              <CreateNote
                bookId={contentOnMainPage?.config?.id}
                shelf={contentOnMainPage?.shelf}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-1 flex flex-col">
      <NavbarNew navAddress={navigationLinks} />

      {/* Content Area */}
      <div className=" p-6 overflow-auto">{body}</div>
    </div>
  );
};

export default MainContent;
