import React, { useEffect, useState } from "react";
import Card from "../Components/Card/Card";
import useAxios from "../Hooks/useAxios";
import { SEARCH_API_END_POINT } from "../Config/CommonApis";
import ShelfLoader from "../Components/Loader/ShelfLoader";
import NavbarNew from "../Components/Header/NavbarNew";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBookCtx } from "../Contexts/BookCtx";

const SearchContent = () => {
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const { axiosInstance, isLoading, setIsLoading, handleError } = useAxios();
  const { deleteNote, deleteBook } = useBookCtx();

  const query = new URLSearchParams(window.location.search).get("query");

  // Fetch search results from the API
  const fetchSearchResults = async (query) => {
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.get(SEARCH_API_END_POINT + query);

      setSearchResults(data);
    } catch (err) {
      handleError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click on a card
  const onClickOnCard = (clickedContent, index) => {
    if (clickedContent?.type === "book") {
      if (clickedContent.shelf?.id) {
        const { id, name } = clickedContent.shelf;

        navigate(
          `/shelf/${name}/${id}/book/${clickedContent.title}/${clickedContent.id}`
        );
      } else {
        navigate(`/book/${clickedContent.title}/${clickedContent.id}`);
      }
    } else if (clickedContent?.type === "page") {
      if (clickedContent?.shelf?.id && clickedContent?.book?.id) {
        const { id: shelfId, name: shelfName } = clickedContent.shelf;
        const { id: bookId, name: bookName } = clickedContent.book;

        navigate(
          `/shelf/${shelfName}/${shelfId}/book/${bookName}/${bookId}/page/${clickedContent.title}/${clickedContent.id}`
        );
      } else if (clickedContent?.book?.id) {
        const { id: bookId, name: bookName } = clickedContent.book;
        navigate(
          `/book/${bookName}/${bookId}/page/${clickedContent.title}/${clickedContent.id}`
        );
      }
    }
  };

  // Handle delete action
  const deleteNoteHandler = async (clickedContent) => {
    if (!clickedContent?.type) {
      handleError("Something went wrong, please try again later!");
      console.error("type not found");
      return;
    }

    setIsLoading(true);

    if (clickedContent.type === "book") {
      await deleteBook(clickedContent.id, clickedContent?.shelf?.id);
    } else {
      await deleteNote(
        clickedContent.id,
        clickedContent?.book?.id || clickedContent?.book_id
      );
    }
    fetchSearchResults(query);
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }

    //eslint-disable-next-line
  }, [query]);

  let body;

  if (isLoading) {
    body = <ShelfLoader />;
  } else {
    body = (
      <div className="flex flex-col h-full p-4">
        {searchResults && searchResults.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((page, i) => (
              <Card
                key={page.id}
                isEdit={false}
                showBookIcon={page?.type === "book"}
                title={page.title}
                description={page.content}
                updatedTime={page.updated_at}
                onClick={() => onClickOnCard(page, i)}
                isActive={false} // Highlight active page
                onDelete={() => deleteNoteHandler(page)} // Pass bookId if available
              />
            ))}
          </div>
        ) : (
          noResultFound(query)
        )}
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-1 flex flex-col">
      <NavbarNew
        noLineClamp={true}
        navAddress={[`Search results for "${query}"`]}
      />

      <div className="h-full overflow-auto">{body}</div>
    </div>
  );
};

export default SearchContent;

const noResultFound = (query) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4 w-full h-full max-w-lg mx-auto">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
      <div className="bg-gray-50 p-6 rounded-full mb-6 border border-gray-100">
        <FaSearch size={36} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        No results found
      </h3>
      <p className="text-gray-600">
        We couldn't find anything matching "
        <span className="font-medium text-blue-600">{query}</span>". Try
        adjusting your search terms.
      </p>
    </div>
  </div>
);
