import React from "react";
import { FaTable } from "react-icons/fa";

const TableTool = ({ editorRef }) => {
  const insertTable = () => {
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.classList.add("editor-table");

    for (let i = 0; i < 3; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("td");
        cell.contentEditable = "true";
        cell.innerHTML = "&nbsp;";
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    const container = document.createElement("div");
    container.classList.add("table-container");
    container.appendChild(table);

    editorRef.current.appendChild(container);
    attachTableHandlers(container, table);
  };

  const attachTableHandlers = (container, table) => {
    table.addEventListener("mouseover", (event) => {
      if (event.target.tagName === "TD") {
        showAddButtons(container, table, event.target);
      }
    });
  };

  const showAddButtons = (container, table, cell) => {
    let rect = cell.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();
    let rowIndex = cell.parentElement.rowIndex;
    let colIndex = cell.cellIndex;

    document
      .querySelectorAll(".add-row, .add-col")
      .forEach((btn) => btn.remove());

    let addRowBtn = document.createElement("button");
    addRowBtn.textContent = "+";
    addRowBtn.classList.add("add-row");
    addRowBtn.style.left = `${rect.left - containerRect.left}px`;
    addRowBtn.style.top = `${rect.bottom - containerRect.top}px`;
    addRowBtn.onclick = () => addRow(table, rowIndex);
    container.appendChild(addRowBtn);

    let addColBtn = document.createElement("button");
    addColBtn.textContent = "+";
    addColBtn.classList.add("add-col");
    addColBtn.style.left = `${rect.right - containerRect.left}px`;
    addColBtn.style.top = `${rect.top - containerRect.top}px`;
    addColBtn.onclick = () => addColumn(table, colIndex);
    container.appendChild(addColBtn);
  };

  const addRow = (table, rowIndex) => {
    let row = table.insertRow(rowIndex + 1);
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      let cell = row.insertCell(i);
      cell.contentEditable = "true";
      cell.innerHTML = "&nbsp;";
    }
  };

  const addColumn = (table, colIndex) => {
    for (let row of table.rows) {
      let cell = row.insertCell(colIndex + 1);
      cell.contentEditable = "true";
      cell.innerHTML = "&nbsp;";
    }
  };

  return (
    <button
      onClick={insertTable}
      className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group border border-gray-100 hover:border-gray-200"
    >
      <div
        className={`w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
      >
        <FaTable size={20} className={"bg-blue-600"} />
      </div>
      <div className="text-center">
        <div className="font-semibold text-sm text-gray-800">Table</div>
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
          Insert Table
        </div>
      </div>
    </button>
  );
};

export default TableTool;
