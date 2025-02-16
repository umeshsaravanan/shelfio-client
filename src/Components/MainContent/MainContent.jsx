import React from "react";
import { useBookCtx } from "../../Contexts/BookCtx";
import NavbarNew from "../Header/NavbarNew";

const MainContent = () => {
  const { contentOnMainPage } = useBookCtx();

  let navigationLinks = [];

  if (contentOnMainPage) {
    if (contentOnMainPage.type === "shelf" && contentOnMainPage.config.name) {
      navigationLinks = [contentOnMainPage.config.name];
    } else if (contentOnMainPage.type === "book") {
      navigationLinks.push(contentOnMainPage.shelf.name);
      navigationLinks.push(contentOnMainPage.config.title);
    } else if (contentOnMainPage.type === "unShelvedBook") {
      navigationLinks.push(contentOnMainPage.config.title);
    }
  }

  return (
    <div className="relative z-10 flex-1 flex flex-col">
      <NavbarNew navAddress={navigationLinks} />

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {[1, 2, 3, 4, 5, 6].map((page) => (
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
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
