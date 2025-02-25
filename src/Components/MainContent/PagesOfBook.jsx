import React, { useEffect, useState } from "react";

import useAxios from "../../Hooks/useAxios";
import { PAGE_API_ENDPOINT } from "../../Config/NotesApiEndPoints";
import ShelfLoader from "../Loader/ShelfLoader";
import Card from "../Card/Card";
import { FaFileAlt } from "react-icons/fa";
import EditorWrapper from "../Editor/EditorWrapper";
import { useBookCtx } from "../../Contexts/BookCtx";
import { useNavigate, useParams } from "react-router-dom";

const PagesOfBook = ({ bookId }) => {
  const [pages, setPages] = useState();
  const { axiosInstance, handleError, isLoading, setIsLoading } = useAxios();
  const [selectedPage, setSelectedPage] = useState();
  const { updateNote } = useBookCtx();
  const navigate = useNavigate();
  const {
    parentType,
    parentName,
    parentId,
    child1Type,
    child1Name,
    child1Id,
    child2Type,
    child2Name,
    child2Id,
  } = useParams();

  const getPagesOfBook = async (id) => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get(PAGE_API_ENDPOINT + "?id=" + id);
      setSelectedPage({ index: 0, page: data[0] });
      setPages(data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPagesOfBook(bookId);
  }, [bookId]);

  useEffect(() => {
    if (!pages || pages.length) {
      return;
    }

    let selectedPageIndex = 0;

    const type = child2Type || child1Type;
    const id = child2Id || child1Id;

    if (type && type === "page") {
      selectedPageIndex = pages.findINdex((page) => page.id === id);
    }

    if (selectedPageIndex !== -1) {
      setSelectedPage(pages[selectedPageIndex]);
    }
  }, [pages]);

  const onSaveHandler = (type, value) => {
    if (!selectedPage) return;

    const pageCopy = { ...selectedPage.page };

    pageCopy[type] = value;
    setSelectedPage((prev) => ({ ...prev, page: pageCopy }));
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

  const onTitleChange = (title) => {
    const pageCopy = { ...selectedPage.page };
    pageCopy.name = title;

    setSelectedPage((prev) => ({ ...prev, page: pageCopy }));
    setSelectedPage((prev) => {
      prev[selectedPage.index] = pageCopy;

      return prev;
    });
  };

  let body;

  if (isLoading) {
    body = <ShelfLoader />;
  } else if (pages && pages.length) {
    body = (
      <div className="h-full flex transition-all duration-300">
        {/* Pages List (Left Side) */}
        <div className="w-1/4  p-4 overflow-y-auto border-r border-gray-200">
          <div className="flex flex-col space-y-4">
            {pages.map((page, i) => (
              <Card
                key={page.id}
                title={page.title}
                description={page.description}
                updatedTime={page.updated_at}
                onClick={() => onClickOnCard(page, i)}
                isActive={page?.id === selectedPage?.id} // Highlight active page
              />
            ))}
          </div>
        </div>

        {/* Editor (Right Side) */}
        <div className="w-3/4 p-6">
          <EditorWrapper
            initialContent={selectedPage?.page?.content}
            initialTitle={selectedPage?.page?.title}
            onSave={onSaveHandler}
            onTitleChange={onTitleChange}
          />
        </div>
      </div>
    );
  }

  return body;
};

export default PagesOfBook;
