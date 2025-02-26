import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import ShelfLoader from "../Loader/ShelfLoader";
import Card from "../Card/Card";
import CreateBook from "../Books/CreateBook";
import { useBookCtx } from "../../Contexts/BookCtx";

const BooksOfShelf = ({ shelfId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editBook, setEditBook] = useState();
  const { parentName, parentId } = useParams();
  const { shelves, getBooksOfShelf, books, deleteBook } = useBookCtx();

  const getBooks = async () => {
    setIsLoading(true);
    await getBooksOfShelf(shelfId);
    setIsLoading(false);
  };

  useEffect(() => {
    getBooks();
    //eslint-disable-next-line
  }, [shelfId]);

  const onClickHandler = (book) => {
    navigate(`/shelf/${parentName}/${parentId}/book/${book.title}/${book.id}`);
  };

  let body;

  const selectedShelfDetails = shelves?.find((shelf) => shelf.id === shelfId);

  if (isLoading) {
    body = <ShelfLoader />;
  } else if (books) {
    body = (
      <div className="flex flex-col h-full p-6 ">
        {books && books.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, i) => (
              <Card
                key={book.id}
                title={book.title}
                description={book.description}
                updatedTime={book.updated_at}
                onClick={() => onClickHandler(book)}
                onDelete={() => deleteBook(book.id, shelfId)}
                onEdit={() => setEditBook(book)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full ">
            <div className="max-w-md space-y-4 p-6 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm text-center">
              <FaBook size={64} className="text-indigo-500 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-800">
                No Books Yet
              </h3>

              <p className="text-sm text-gray-600">
                Start by creating your first book. Organize your books, ideas,
                and thoughts in one place.
              </p>

              <CreateBook
                shelf={{
                  id: selectedShelfDetails?.id,
                  name: selectedShelfDetails?.name,
                  icon: selectedShelfDetails?.icon,
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {editBook && (
        <CreateBook
          prefillData={editBook}
          onClose={() => setEditBook(undefined)}
        />
      )}
      {body}
    </div>
  );
};

export default BooksOfShelf;
