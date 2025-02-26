import React from "react";
import ReactDOM from "react-dom";

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-10">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-all sm:max-w-lg w-full ">
        {children}
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default Popup;
