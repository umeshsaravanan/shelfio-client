import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import useAxios from "../Hooks/useAxios";
import { PAGE_API_ENDPOINT } from "../Config/NotesApiEndPoints";
import {
  BOOK_API_ENDPOINT,
  SHELVES_API_ENDPOINT,
  UN_SHELVED_BOOKS_API_ENDPOINT,
} from "../Config/BoookApiEndpoints";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthCtx } from "./AuthCtx";

const BookCtxApi = createContext();

const useBookCtx = () => useContext(BookCtxApi);

const BookCtx = ({ children }) => {
  const [contentOnMainPage, SetContentOnMainPage] = useState(undefined);
  const [books, setBooks] = useState();
  const [unShelvedBooks, setUnShelvedBooks] = useState([]);
  const [shelves, setShelves] = useState();
  const [allNotes, setAllNotes] = useState();
  const [showOverlayLoading, setShowOverlayLoading] = useState(false);
  const [pages, setPages] = useState();
  const [selectedPage, setSelectedPage] = useState();

  const selectedNote = useRef();
  const { axiosInstance, handleError } = useAxios();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthCtx();
  const { parentType, shelfId } = useParams();

  const getPagesOfBook = async (id) => {
    try {
      const { data } = await axiosInstance.get(PAGE_API_ENDPOINT + "?id=" + id);
      setSelectedPage({ index: 0, page: data[0] });
      setPages(data);
    } catch (error) {
      handleError(error);
    }
  };

  const createBook = async (payload) => {
    try {
      await axiosInstance.post(BOOK_API_ENDPOINT, payload);
      getBooksOfShelf(payload.shelf.id);
      getUnShelvedBooks();
      getShelves();
    } catch (error) {
      handleError(error);
    }
  };

  const deleteBook = async (id, shelfId) => {
    setShowOverlayLoading(true);

    try {
      await axiosInstance.delete(BOOK_API_ENDPOINT + "?id=" + id);

      if (shelfId) {
        getBooksOfShelf(shelfId);
      }

      getUnShelvedBooks();
      getPagesOfBook(id);
      getShelves();
    } catch (error) {
      handleError(error);
    } finally {
      setShowOverlayLoading(false);
    }
  };

  const updateBook = async (content) => {
    try {
      await axiosInstance.put(BOOK_API_ENDPOINT, content);
      await getBooksOfShelf(content.shelf.id);
      await getShelves();
      await getUnShelvedBooks();
    } catch (error) {
      handleError(error);
    }
  };

  const createShelf = async (payload) => {
    try {
      await axiosInstance.post(SHELVES_API_ENDPOINT, payload);
      getShelves();
    } catch (error) {
      handleError(error);
    }
  };

  const getShelves = async (isInitialCall) => {
    try {
      const { data } = await axiosInstance.get(SHELVES_API_ENDPOINT);

      setShelves(data);

      if (isInitialCall && data && data.length && !parentType) {
        const firstShelf = data[0];

        navigate(`/shelf/${firstShelf.name}/${firstShelf.id}`);
      }

      if (parentType === "shelf") {
        getBooksOfShelf(shelfId);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const updateShelf = async (content) => {
    setShowOverlayLoading(true);
    try {
      await axiosInstance.put(SHELVES_API_ENDPOINT, content);
      await getShelves();
    } catch (error) {
      handleError(error);
    } finally {
      setShowOverlayLoading(false);
    }
  };

  const deleteShelf = async (id) => {
    setShowOverlayLoading(true);

    try {
      await axiosInstance.delete(SHELVES_API_ENDPOINT + "?id=" + id);
      getUnShelvedBooks();
      getShelves();
      getBooksOfShelf(id);
    } catch (error) {
      handleError(error);
    } finally {
      setShowOverlayLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getShelves(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const getUnShelvedBooks = async () => {
    try {
      const { data } = await axiosInstance.get(UN_SHELVED_BOOKS_API_ENDPOINT);
      setUnShelvedBooks(data);
      // setBooks(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUnShelvedBooks();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const getBooksOfShelf = async (id) => {
    if (!id) return;

    try {
      const { data } = await axiosInstance.get(
        BOOK_API_ENDPOINT + "?shelf=" + id
      );

      setBooks(data);
    } catch (error) {
      handleError(error);
    }
  };

  const createNote = async (payload) => {
    try {
      await axiosInstance.post(PAGE_API_ENDPOINT, payload);

      getPagesOfBook(payload.book.id);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteNote = async (id, bookId) => {
    setShowOverlayLoading(true);

    try {
      await axiosInstance.delete(PAGE_API_ENDPOINT + "?id=" + id);

      getPagesOfBook(bookId);
      getShelves();
    } catch (error) {
      handleError(error);
    } finally {
      setShowOverlayLoading(false);
    }
  };

  const getAllNotes = async (bookId, callback) => {
    try {
      const { data } = await axiosInstance(PAGE_API_ENDPOINT + "?id=" + bookId);

      setAllNotes(data);

      if (callback) callback(data);

      return data;
    } catch (error) {
      handleError(error);
    }
  };

  const updateNote = async (content) => {
    try {
      await axiosInstance.put(PAGE_API_ENDPOINT, content);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <BookCtxApi.Provider
      value={{
        books,
        createBook,
        createShelf,
        createNote,
        getAllNotes,
        deleteBook,
        deleteNote,
        deleteShelf,
        getBooksOfShelf,
        getPagesOfBook,
        updateBook,
        updateShelf,
        pages,
        setPages,
        selectedPage,
        allNotes,
        unShelvedBooks,
        shelves,
        setAllNotes,
        selectedNote,
        updateNote,
        getUnShelvedBooks,
        contentOnMainPage,
        SetContentOnMainPage,
        showOverlayLoading,
        setShowOverlayLoading,
        setSelectedPage,
      }}
    >
      {children}
    </BookCtxApi.Provider>
  );
};

export default BookCtx;
export { useBookCtx };
