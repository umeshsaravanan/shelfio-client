import React from "react";
import moment from "moment";
import { FaBook } from "react-icons/fa";

const Card = ({ title, updatedTime, description, onClick, isActive }) => {
  const dateTime = updatedTime ? moment(updatedTime).fromNow() : undefined;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer ${
        isActive ? "border-indigo-600 shadow-lg" : "hover:border-indigo-300"
      }`}
    >
      {/* Transparent Overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" />
      )}

      <div className="flex items-center gap-2 mb-3">
        <FaBook
          size={16}
          className={`${isActive ? "text-indigo-800" : "text-indigo-600"}`}
        />
        <h3
          className={`font-medium ${
            isActive ? "text-indigo-900" : "text-gray-800"
          } mb-2`}
        >
          {title}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">{`updated at ${dateTime}`}</p>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
    </div>
  );
};

export default Card;
