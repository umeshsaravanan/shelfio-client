import React from "react";
import moment from "moment";
import { FaBook } from "react-icons/fa";

const Card = ({ title, updatedTime, description }) => {
  const dateTime = updatedTime ? moment(updatedTime).fromNow() : undefined;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <FaBook size={16} className="text-indigo-600" />
        <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">{`updated at ${dateTime}`}</p>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
    </div>
  );
};

export default Card;
