import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import useAxios from "../Hooks/useAxios";
import { NOTE_API_ENDPOINT } from "../Config/NotesApiEndPoints";
import {
  BOOK_API_ENDPOINT,
  SHELVES_API_ENDPOINT,
  UN_SHELVED_BOOKS_API_ENDPOINT,
} from "../Config/BoookApiEndpoints";

const BookCtxApi = createContext();

const useBookCtx = () => useContext(BookCtxApi);

const BookCtx = ({ children }) => {
  const [contentOnMainPage, SetContentOnMainPage] = useState(undefined);
  const [books, setBooks] = useState();
  const [shelves, setShelves] = useState();
  const [allNotes, setAllNotes] = useState();
  const [showOverlayLoading, setShowOverlayLoading] = useState(false);

  const selectedNote = useRef();

  const { axiosInstance, handleError } = useAxios();

  const createBook = async (payload) => {
    try {
      await axiosInstance.post(BOOK_API_ENDPOINT, payload);
      getBooks();
      getShelves();
    } catch (error) {
      handleError(error);
    }
  };

  const createShelf = async (payload) => {
    try {
      await axiosInstance.post(SHELVES_API_ENDPOINT, payload);
      getBooks();
      getShelves();
    } catch (error) {
      handleError(error);
    }
  };

  const getShelves = async () => {
    try {
      const { data } = await axiosInstance.get(SHELVES_API_ENDPOINT);

      setShelves(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getShelves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBooks = async () => {
    try {
      const { data } = await axiosInstance.get(UN_SHELVED_BOOKS_API_ENDPOINT);

      setBooks(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBooksOfShelf = async (id) => {
    try {
      const { data } = await axiosInstance.get(
        BOOK_API_ENDPOINT + "?shelf=" + id
      );

      return data;
    } catch (error) {
      handleError(error);
    }
  };

  const createNote = async (payload) => {
    try {
      await axiosInstance.post(NOTE_API_ENDPOINT, payload);

      getAllNotes(payload.book_id);
    } catch (error) {
      handleError(error);
    }
  };

  const getAllNotes = async (bookId) => {
    try {
      const { data } = await axiosInstance(NOTE_API_ENDPOINT + "?id=" + bookId);

      setAllNotes(data);

      return data;
    } catch (error) {
      handleError(error);
    }
  };

  const updateNote = async (content) => {
    try {
      await axiosInstance.put(NOTE_API_ENDPOINT, content);

      getAllNotes(content.book_id);
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
        getBooksOfShelf,
        allNotes,
        shelves,
        setAllNotes,
        selectedNote,
        updateNote,
        getBooks,
        contentOnMainPage,
        SetContentOnMainPage,
        showOverlayLoading,
        setShowOverlayLoading,
      }}
    >
      {children}
    </BookCtxApi.Provider>
  );
};

export default BookCtx;
export { useBookCtx };
