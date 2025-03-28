import React, { useState } from "react";
import { GiBookshelf } from "react-icons/gi";
import { FaBook, FaFileAlt, FaPlus } from "react-icons/fa";
import Popup from "../Popup/Popup";
import { useBookCtx } from "../../Contexts/BookCtx";
import Dropdown from "../Dropdown/Dropdown";
import { icons } from "../Icons/ShelfIcons";
import BtnLoader from "../Loader/BtnLoader";

const CreateBook = ({
  prefillData,
  shelf,
  onClose = () => {},
  isTextBtn = false,
}) => {
  const [showPopup, setShowPopup] = useState(prefillData ? true : false);
  const [bookData, setBookData] = useState(
    prefillData || {
      title: "",
      shelf: shelf || { id: "", name: "", icon: "" },
      description: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { createBook, shelves, updateBook, selectedShelf } = useBookCtx();
  const [error, setError] = useState("");

  const validateName = (name) => {
    if (!name.trim()) return "Book name is required.";
    if (name.length < 3) return "Book name must be at least 3 characters.";
    if (name.length > 50) return "Book name must be under 50 characters.";
    return "";
  };

  const handleChange = (e) => {
    setError("");
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const onDropdownChange = (selectedOption) => {
    setBookData({
      ...bookData,
      shelf: {
        id: selectedOption.id,
        name: selectedOption.name,
        icon: selectedOption.iconId,
      },
    });
  };

  const btnHandler = async () => {
    const validationError = validateName(bookData.title);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    if (prefillData) {
      await updateBook(bookData);
    } else {
      await createBook({ ...bookData });
    }

    setIsLoading(false);
    setShowPopup(false);
    onClose();
    setBookData({ title: "", shelf: "", description: "" });
  };

  const getSelfIcons = (shelfIcon) => {
    const icon = icons?.[shelfIcon] || undefined;

    return icon;
  };

  const getShelfDropdownOptions = (shelves) => {
    const options = [];

    if (shelves && shelves.length) {
      shelves.map((shelf) =>
        options.push({
          id: shelf.id,
          name: shelf.name,
          icon: getSelfIcons(shelf?.icon),
          iconId: shelf?.icon,
        })
      );
    }

    return options;
  };

  const onCloseHandler = () => {
    setShowPopup(false);
    onClose();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      btnHandler();
    }
  };

  let btn;

  if (isTextBtn) {
    btn = (
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        <FaPlus size={16} />
        <span>New Book</span>
      </button>
    );
  } else {
    btn = (
      <button
        onClick={() => setShowPopup(true)}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors mb-6 shadow-md hover:shadow-lg"
      >
        <FaPlus size={18} />
        <span className="font-medium">New Book</span>
      </button>
    );
  }
  debugger
  return (
    <div className="relative flex w-full">
      {!prefillData && btn}

      <Popup heading="Create Book" isOpen={showPopup} onClose={onCloseHandler}>
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            <div className="flex items-center gap-2">
              <FaBook className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                {prefillData ? "Update Book" : "Create New Book"}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FaBook className="w-4 h-4 text-indigo-500" />
                Book Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                autoFocus
                placeholder="Enter a meaningful title for your book"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={bookData.title}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />

              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            {/* Shelf Selection */}
            <div className="space-y-2">
              <label
                htmlFor="shelf"
                className="text-sm font-medium flex items-center gap-2"
              >
                <GiBookshelf className="w-4 h-4 text-indigo-500" />
                Select Shelf{" "}
                <span className="text-gray-500">{"(Optional)"}</span>
              </label>
              <Dropdown
                defaultText="Choose a shelf"
                options={getShelfDropdownOptions(shelves)}
                handleChange={onDropdownChange}
                value={{
                  name: selectedShelf?.name,
                  icon: getSelfIcons(selectedShelf?.icon),
                }}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FaFileAlt className="w-4 h-4 text-indigo-500" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Add a brief description of your book's content (Optional)"
                className="resize-none w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={bookData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
            <button
              onClick={onCloseHandler}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={btnHandler}
              disabled={!bookData.title.trim() || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg min-w-32 ${
                !bookData.title.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
            >
              {isLoading ? <BtnLoader /> : getBtnText(prefillData)}
            </button>
          </div>
        </>
      </Popup>
    </div>
  );
};

export default CreateBook;

const getBtnText = (prefillData) => {
  let btnContent = (
    <>
      <FaPlus className="w-4 h-4 inline-block mr-2" />
      Create Book
    </>
  );

  if (prefillData) {
    btnContent = "Update Book";
  }

  return btnContent;
};
