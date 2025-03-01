import React from "react";
import { FaPlus } from "react-icons/fa";

import { useBookCtx } from "../../Contexts/BookCtx";

const CreateNote = ({
  bookId,
  bookName,
  shelfId,
  shelfName,
  isTextBtn = false,
}) => {
  const { createNote, setShowOverlayLoading } = useBookCtx();

  const createBtnHandler = async () => {
    setShowOverlayLoading(true);

    const payload = {
      title: "",
      book: { id: bookId, name: bookName },
      content: "",
      shelf: { id: shelfId, name: shelfName },
    };

    await createNote(payload);
    setShowOverlayLoading(false);
  };

  let btn;

  if (isTextBtn) {
    btn = (
      <button
        onClick={createBtnHandler}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        <FaPlus size={16} />
        <span>New Page</span>
      </button>
    );
  } else {
    btn = (
      <button
        onClick={createBtnHandler}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors mb-6 shadow-md hover:shadow-lg"
      >
        <FaPlus size={18} />
        <span className="font-medium">New Page</span>
      </button>
    );
  }

  return btn;
};

export default CreateNote;
