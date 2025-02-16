import React, { useState } from "react";
import { GiBookshelf } from "react-icons/gi";
import { FaBook, FaBookmark, FaFileAlt, FaPlus } from "react-icons/fa";
import Popup from "../Popup/Popup";
import { useBookCtx } from "../../Contexts/BookCtx";
import Dropdown from "../Dropdown/Dropdown";
import { icons } from "../Icons/ShelfIcons";

const CreateBook = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    shelf: { id: "", name: "", icon: "" },
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { createBook, shelves } = useBookCtx();

  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const onDropdownChange = (selectedOption) => {
    console.log({ selectedOption });
    setBookData({
      ...bookData,
      shelf: {
        id: selectedOption.id,
        name: selectedOption.name,
        icon: selectedOption.iconId,
      },
    });
  };

  const createBtnHandler = async () => {
    if (!bookData.title.trim()) return;

    setIsLoading(true);

    await createBook({ ...bookData });

    setIsLoading(false);
    setShowPopup(false);
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

  return (
    <div className="relative flex w-full">
      <button
        onClick={() => setShowPopup(true)}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors mb-6 shadow-md hover:shadow-lg"
      >
        <FaPlus size={18} />
        <span className="font-medium">New Book</span>
      </button>

      <Popup
        heading="Create Book"
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            <div className="flex items-center gap-2">
              <FaBook className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Create New Book</h2>
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
                placeholder="Enter a meaningful title for your book"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={bookData.title}
                onChange={handleChange}
              />
            </div>

            {/* Shelf Selection */}
            <div className="space-y-2">
              <label
                htmlFor="shelf"
                className="text-sm font-medium flex items-center gap-2"
              >
                <GiBookshelf className="w-4 h-4 text-indigo-500" />
                Select Shelf
              </label>
              <Dropdown
                defaultText="Choose a shelf (Optional)"
                options={getShelfDropdownOptions(shelves)}
                handleChange={onDropdownChange}
                value={{
                  name: bookData?.shelf?.name,
                  icon: getSelfIcons(bookData?.shelf?.icon),
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
                className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={bookData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 border bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createBtnHandler}
              disabled={!bookData.title.trim() || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg ${
                !bookData.title.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
            >
              <FaPlus className="w-4 h-4 inline-block mr-2" />
              Create Book
            </button>
          </div>
        </>
      </Popup>
    </div>
  );
};

export default CreateBook;
