// Sidebar.js
import React from "react";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import { HiLibrary } from "react-icons/hi";
import CreateBook from "../Books/CreateBook";

const Sidebar = () => {
  return (
    <div className="relative z-10 w-72 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-indigo-600">
            <rect
              x="10"
              y="70"
              width="80"
              height="10"
              className="fill-current"
            />
            <rect
              x="15"
              y="30"
              width="10"
              height="40"
              className="fill-current opacity-50"
            />
            <rect
              x="30"
              y="20"
              width="10"
              height="50"
              className="fill-current opacity-70"
            />
            <rect
              x="45"
              y="40"
              width="10"
              height="30"
              className="fill-current opacity-50"
            />
            <rect
              x="60"
              y="10"
              width="10"
              height="60"
              className="fill-current opacity-70"
            />
            <rect
              x="75"
              y="50"
              width="10"
              height="20"
              className="fill-current opacity-50"
            />
          </svg>
          <h1 className="text-xl font-bold text-gray-800">shelf.io</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books and pages..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* New Book Button */}
        <CreateBook />

        {/* Books List */}
        <div className="space-y-4">
          {/* Shelved Books */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <HiLibrary size={16} />
                <span>Shelves</span>
              </div>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline">
                New Shelf
              </button>
            </div>

            {/* Study Materials Shelf */}
            <div className="mb-3">
              <button className="w-full flex items-center text-left px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FaChevronDown size={16} className="mr-2" />
                <span className="flex-1">Study Materials</span>
                <span className="text-xs text-gray-500">3 books</span>
              </button>
              <div className="pl-6 mt-1 space-y-1">
                <button className="w-full flex items-center text-left px-2 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg">
                  <FaBook size={16} className="mr-2" />
                  <span>System Design</span>
                </button>
                <button className="w-full flex items-center text-left px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                  <FaBook size={16} className="mr-2" />
                  <span>React Notes</span>
                </button>
                <button className="w-full flex items-center text-left px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                  <FaBook size={16} className="mr-2" />
                  <span>AWS Notes</span>
                </button>
              </div>
            </div>

            {/* Work Projects Shelf */}
            <div>
              <button className="w-full flex items-center text-left px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FaChevronRight size={16} className="mr-2" />
                <span className="flex-1">Work Projects</span>
                <span className="text-xs text-gray-500">2 books</span>
              </button>
            </div>
          </div>

          {/* Unshelved Books */}
          <div>
            <div className="flex items-center gap-2 px-2 mb-3 text-sm font-medium text-gray-600">
              <FaBook size={16} />
              <span>Unshelved Books</span>
            </div>
            <div className="pl-4 space-y-1">
              <button className="w-full flex items-center text-left px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                <FaBook size={16} className="mr-2" />
                <span>Meeting Notes</span>
              </button>
              <button className="w-full flex items-center text-left px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                <FaBook size={16} className="mr-2" />
                <span>Personal Journal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
