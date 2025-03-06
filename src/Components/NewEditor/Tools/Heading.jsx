import React from "react";

const HeadingsGroup = ({ changeHeading }) => {
  return (
    <div className="w-12">
      <select
        onChange={(e) => changeHeading(e.target.value)}
        className="toolbar-select"
        title="Headings"
      >
        <option value="">Aa</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
    </div>
  );
};

export default HeadingsGroup;
