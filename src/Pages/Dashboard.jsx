import React from "react";
import {
  FaBook,
  FaPlus,
  FaCog,
  FaSearch,
  FaChevronRight,
  FaChevronDown,
  FaFileAlt,
} from "react-icons/fa";
import { HiLibrary } from "react-icons/hi";
import Sidebar from "../Components/Sidebar/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Study Materials</span>
            <FaChevronRight size={16} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              System Design
            </h2>
            <span className="text-sm text-gray-500">12 pages</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <FaPlus size={16} />
              <span>New Page</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FaCog size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <div
                key={page}
                className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FaFileAlt size={16} className="text-indigo-600" />
                  <span className="text-sm text-gray-600">Page {page}</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Architecture Overview
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Last edited 2 hours ago
                </p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  System architecture details and component interactions. Key
                  points about scalability and performance considerations.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
