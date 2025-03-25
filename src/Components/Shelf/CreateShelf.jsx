import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdOutlineInsertEmoticon } from "react-icons/md";

import Popup from "../Popup/Popup";
import { useBookCtx } from "../../Contexts/BookCtx";
import { shelfICons } from "../Icons/ShelfIcons";
import BtnLoader from "../Loader/BtnLoader";

const CreateShelf = ({ prefillShelf, onClose = () => {} }) => {
  const [isOpen, setIsOpen] = useState(prefillShelf ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [shelfData, setShelfData] = useState(
    prefillShelf || {
      name: "",
      icon: "",
    }
  );
  const [error, setError] = useState("");

  const { createShelf, updateShelf } = useBookCtx();

  const validateName = (name) => {
    if (!name.trim()) return "Shelf name is required.";
    if (name.length < 3) return "Shelf name must be at least 3 characters.";
    if (name.length > 50) return "Shelf name must be under 50 characters.";
    return "";
  };

  const handleCreateShelf = async () => {
    const validationError = validateName(shelfData.name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    await createShelf({ ...shelfData });
    setIsLoading(false);

    setIsOpen(false);
    setShelfData({ name: "", icon: "" });
  };

  const handleUpdateShelf = () => {
    const validationError = validateName(shelfData.name);
    if (validationError) {
      setError(validationError);
      return;
    }

    updateShelf({ ...shelfData });
    onClose();
    setIsOpen(false);
  };

  const onCancelHandler = () => {
    setIsOpen(false);
    onClose();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      prefillShelf ? handleUpdateShelf() : handleCreateShelf();
    }
  };

  return (
    <>
      {!prefillShelf ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
        >
          <FaPlus className="w-3 h-3" />
          New Shelf
        </button>
      ) : null}

      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-t-lg">
            <div className="flex items-center gap-2">
              <GiBookshelf className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                {prefillShelf ? "Update Shelf" : "Create New Shelf"}
              </h2>
            </div>
            {!prefillShelf && (
              <p className="text-indigo-50 mt-2">
                Create a new shelf to organize your books and notes.
              </p>
            )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Shelf Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <GiBookshelf className="w-4 h-4 text-indigo-500" />
                Shelf Name
              </label>
              <input
                autoFocus
                id="name"
                type="text"
                placeholder="Enter a name for your shelf"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shelfData.name}
                onChange={(e) => {
                  setShelfData({ ...shelfData, name: e.target.value });
                  setError(""); // Clear error when user types
                }}
                onKeyDown={handleEnter}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            {/* Choose Icon */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MdOutlineInsertEmoticon className="w-4 h-4 text-indigo-500" />
                Choose Icon
              </label>
              <div className="grid grid-cols-7 gap-2">
                {shelfICons.map(({ id, icon: Icon, color }) => (
                  <div key={id} className="flex items-center justify-center">
                    <input
                      type="radio"
                      id={id}
                      name="icon"
                      value={id}
                      checked={shelfData.icon === id}
                      onChange={() => setShelfData({ ...shelfData, icon: id })}
                      className="sr-only"
                    />
                    <label
                      htmlFor={id}
                      className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        shelfData.icon === id
                          ? "border-indigo-500 bg-indigo-50"
                          : ""
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${color}`} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg flex justify-end gap-2">
            <button
              onClick={onCancelHandler}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={prefillShelf ? handleUpdateShelf : handleCreateShelf}
              disabled={!shelfData.name.trim()}
              className={`min-w-[150px] px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg ${
                !shelfData.name.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
            >
              {isLoading ? (
                <BtnLoader />
              ) : prefillShelf ? (
                "Update Shelf"
              ) : (
                "Create Shelf"
              )}
            </button>
          </div>
        </>
      </Popup>
    </>
  );
};

export default CreateShelf;
