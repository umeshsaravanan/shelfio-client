import React, { useEffect, useState } from "react";

import ShelfLoader from "../Loader/ShelfLoader";
import Card from "../Card/Card";
import EditorWrapper from "../Editor/EditorWrapper";
import { useBookCtx } from "../../Contexts/BookCtx";
import { useNavigate, useParams } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import CreateNote from "../Notes/CreateNote";
import { generatePath } from "../../Util/GeneratePath";

const PagesOfBook = ({ bookId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    getPagesOfBook,
    pages,
    selectedPage,
    setSelectedPage,
    updateNote,
    deleteNote,
    setPages,
  } = useBookCtx();
  const navigate = useNavigate();

  const {
    parentType,
    parentName,
    parentId,
    child1Type,
    child1Name,
    child1Id,
    child2Type,
    child2Id,
  } = useParams();

  const getPages = async (isNavigate) => {
    setIsLoading(true);
    await getPagesOfBook(bookId, isNavigate);
    setIsLoading(false);
  };

  useEffect(() => {
    getPages(true);

    //eslint-disable-next-line
  }, [bookId]);

  useEffect(() => {
    if (!pages || pages.length) {
      return;
    }

    let selectedPageIndex = 0;

    const type = child2Type || child1Type;
    const id = child2Id || child1Id;

    if (type && type === "page") {
      selectedPageIndex = pages.findIndex((page) => page.id === id);
    }

    if (selectedPageIndex !== -1) {
      setSelectedPage(pages[selectedPageIndex]);

      const page = pages[selectedPageIndex];

      if (page) {
        const link =
          "/" +
          generatePath(page?.shelf, page?.book, {
            id: page?.id,
            name: page?.title,
          });

        navigate(link);
      }
    }

    //eslint-disable-next-line
  }, [pages]);

  const onSaveHandler = (type, value) => {
    if (!selectedPage) return;

    const pageCopy = { ...selectedPage.page };

    pageCopy[type] = value;

    editorOnChange(type, value);
    updateNote(pageCopy);
  };

  const onClickOnCard = (page, index) => {
    let link = `/${parentType}/${parentName}/${parentId}/`;

    if (child1Id) {
      link += `${child1Type}/${child1Name}/${child1Id}/`;
    }

    link += `page/${page.title}/${page.id}`;

    navigate(link);

    setSelectedPage({ index, page });
  };

  const editorOnChange = (key, value) => {
    const pageCopy = { ...selectedPage };
    const pagesCopy = [...pages];

    pageCopy.page[key] = value;
    pagesCopy[selectedPage.index] = pageCopy.page;

    setSelectedPage(pageCopy);
    setPages(pagesCopy);
  };

  let shelfId;
  let shelfName;
  if (parentType === "shelf") {
    shelfId = parentId;
    shelfName = parentName;
  }

  let bookName;
  let pageId;

  if (child1Type === "book") {
    bookName = child1Name;
    pageId = child2Id;
  } else if (parentType === "book") {
    bookName = parentName;
    pageId = child1Id;
  }

  if (!pageId && pages && pages.length) {
    pageId = pages[0].id;
  }

  let body;
  debugger
  if (isLoading) {
    body = <ShelfLoader />;
  } else {
    body = (
      <div className="flex flex-col h-full ">
        {pages && pages.length ? (
          <div className="h-full flex transition-all duration-300">
            {/* Pages List (Left Side) */}
            <div className="w-1/4  p-4 overflow-y-auto border-r border-gray-200">
              <div className="flex flex-col space-y-4">
                {pages.map((page, i) => (
                  <Card
                    key={page.id}
                    title={page.title}
                    description={page.content}
                    updatedTime={page.updated_at}
                    onClick={() => onClickOnCard(page, i)}
                    isActive={page?.id === selectedPage.page.id} // Highlight active page
                    onDelete={() => deleteNote(page.id, bookId)}
                    isEdit={false}
                  />
                ))}
              </div>
            </div>

            {/* Editor (Right Side) */}
            <div className="w-3/4 p-4">
              <EditorWrapper
                initialContent={selectedPage?.page?.content}
                initialTitle={selectedPage?.page?.title}
                onSave={onSaveHandler}
                onTitleChange={(title) => editorOnChange("title", title)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full ">
            <div className="max-w-md space-y-4 p-6 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm text-center">
              <FaFileAlt size={64} className="text-indigo-500 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800">
                No Pages Yet
              </h3>

              <p className="text-sm text-gray-600">
                Start by creating your first page. Organize your pages, ideas,
                and thoughts in one place.
              </p>

              <CreateNote
                shelfName={shelfName}
                bookId={bookId}
                shelfId={shelfId}
                bookName={bookName}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return body;
};

export default PagesOfBook;
