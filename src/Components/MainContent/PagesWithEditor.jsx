import React from "react";

import Card from "../Card/Card";
import EditorWrapper from "../Editor/EditorWrapper";

const PagesWithEditor = ({ card, onClickHandler, page, onSaveHandler }) => {
  return (
    <div className="h-full flex transition-all duration-300">
      {/* Pages List (Left Side) */}
      <div className="w-1/4  p-4 overflow-y-auto border-r border-gray-200">
        <div className="flex flex-col space-y-4">
          {card.map((eachCard, i) => (
            <Card
              key={eachCard.title + i}
              title={eachCard.title}
              description={eachCard.description}
              updatedTime={eachCard.updatedDate}
              onClick={() =>
                onClickHandler(eachCard.allData, eachCard.type, eachCard.shelf)
              }
              isActive={page?.id === eachCard.allData.id} // Highlight active page
            />
          ))}
        </div>
      </div>

      {/* Editor (Right Side) */}
      <div className="w-3/4 p-6">
        <EditorWrapper
          initialContent={page?.content}
          initialTitle={page?.title}
          onSave={onSaveHandler}
        />
      </div>
    </div>
  );
};

export default PagesWithEditor;
