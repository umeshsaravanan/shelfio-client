import React, { useEffect, useState } from "react";
import useAxios from "../../Hooks/useAxios";
import { BOOK_API_ENDPOINT } from "../../Config/BoookApiEndpoints";
import ShelfLoader from "../Loader/ShelfLoader";
import Card from "../Card/Card";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const BooksOfShelf = ({ shelfId }) => {
  const [books, setBooks] = useState();
  const { axiosInstance, handleError, isLoading, setIsLoading } = useAxios();
  const navigate = useNavigate();
  const { parentName, parentId } = useParams();

  const getBooksOfShelf = async (id) => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get(
        BOOK_API_ENDPOINT + "?shelf=" + id
      );

      setBooks(data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBooksOfShelf(shelfId);

    //eslint-disable-next-line
  }, [shelfId]);

  const onClickHandler = (book) => {
    navigate(`/shelf/${parentName}/${parentId}/book/${book.title}/${book.id}`);
  };

  let body;

  if (isLoading) {
    body = <ShelfLoader />;
  } else if (books) {
    body = (
      <div className="flex flex-col h-full ">
        {books && books.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, i) => (
              <Card
                key={book.id}
                title={book.title}
                description={book.description}
                updatedTime={book.updated_at}
                // isActive={page?.id === eachCard.allData.id}
                onClick={() => onClickHandler(book)}
                // onDelete={() => onDelete(eachCard.allData.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full ">
            <div className="max-w-md space-y-4 p-6 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm text-center">
              <FaFileAlt size={64} className="text-indigo-500 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800">
                No Pages Yet
              </h3>
              <p className="text-sm text-gray-600">
                Start by creating your first page. Organize your notes, ideas,
                and thoughts in one place.
              </p>

              {/* <CreateNote
                bookId={contentOnMainPage?.config?.id}
                shelf={contentOnMainPage?.shelf}
              /> */}
            </div>
          </div>
        )}
      </div>
    );
  }

  return body;
};

export default BooksOfShelf;
