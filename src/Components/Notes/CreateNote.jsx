import React from "react";
import { FaPlus } from "react-icons/fa";

import { useBookCtx } from "../../Contexts/BookCtx";
import AddButton from "../Buttons/AddButton";

const CreateNote = ({ bookId, shelf }) => {
  const { createNote, setShowOverlayLoading } = useBookCtx();

  const createBtnHandler = async () => {
    setShowOverlayLoading(true);
    const payload = { title: "", book_id: bookId, content: "", shelf };

    await createNote(payload);
    setShowOverlayLoading(false);
  };

  return (
    <button
      onClick={createBtnHandler}
      className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors mx-auto shadow-md hover:shadow-lg"
    >
      <FaPlus size={16} />
      <span>Create New Page</span>
    </button>
  );
};

export default CreateNote;
