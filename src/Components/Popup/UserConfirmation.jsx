import React from "react";
import ReactDOM from "react-dom";

const UserConfirmation = ({ cancelDelete, confirmDelete, message }) => {
  // Use ReactDOM.createPortal to render the component outside the current DOM hierarchy
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p dangerouslySetInnerHTML={{ __html: message }} className="mb-4"></p>
        <div className="flex justify-end gap-2 z-40">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,

    document.getElementById("root") // Portal target
  );
};

export default UserConfirmation;
