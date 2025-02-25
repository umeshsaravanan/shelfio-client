import React from "react";
import Card from "../Card/Card";
import { FaFileAlt } from "react-icons/fa";
import CreateNote from "../Notes/CreateNote";

const Pages = ({ contentOnMainPage, card, onClickHandler, page, onDelete }) => {
  return (
    <div className="flex flex-col h-full ">
      {contentOnMainPage && card?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {card.map((eachCard, i) => (
            <Card
              key={eachCard.title + i}
              title={eachCard.title}
              description={eachCard.description}
              updatedTime={eachCard.updatedDate}
              isActive={page?.id === eachCard.allData.id}
              onClick={() =>
                onClickHandler(eachCard.allData, eachCard.type, eachCard.shelf)
              }
              onDelete={() => onDelete(eachCard.allData.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full ">
          <div className="max-w-md space-y-4 p-6 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm text-center">
            <FaFileAlt size={64} className="text-indigo-500 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800">
              No Pages Yet
            </h3>
            <p className="text-sm text-gray-600">
              Start by creating your first page. Organize your notes, ideas, and
              thoughts in one place.
            </p>

            <CreateNote
              bookId={contentOnMainPage?.config?.id}
              shelf={contentOnMainPage?.shelf}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
