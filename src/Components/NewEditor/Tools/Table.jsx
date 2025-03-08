import React from "react";
import { FaTable } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const TableTool = ({ editorRef }) => {
  const insertTable = (uuid) => {
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.classList.add("editor-table");
    table.id = `table-${uuid}`;

    for (let i = 0; i < 3; i++) {
      const row = document.createElement("tr");
      row.id = `row-${uuid}-${i}`;

      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("td");
        cell.contentEditable = "true";
        cell.innerHTML = "&nbsp;";
        cell.id = `cell-${uuid}-${i}-${j}`;
        cell.classList.add("resizable-cell");

        // Add kebab menu
        const kebabMenu = document.createElement("div");
        kebabMenu.innerHTML = "⋮";
        kebabMenu.classList.add("kebab-menu");
        kebabMenu.onclick = (event) => showPopup(event, cell, table, uuid);
        cell.appendChild(kebabMenu);

        // Add resize handle
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        resizeHandle.onmousedown = (e) => startResizing(e, cell);
        cell.appendChild(resizeHandle);

        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    const container = document.createElement("div");
    container.classList.add("table-container");
    container.appendChild(table);
    container.id = `table-container-${uuid}`;

    editorRef.current.appendChild(container);
  };

  const showPopup = (event, cell, table, uuid) => {
    event.stopPropagation();

    document.querySelectorAll(".popup-menu").forEach((popup) => popup.remove());

    const popup = document.createElement("div");
    popup.classList.add("popup-menu");
    popup.style.left = `${event.clientX}px`;
    popup.style.top = `${event.clientY}px`;

    const addRowBtn = document.createElement("button");
    addRowBtn.textContent = "Add Row";
    addRowBtn.onclick = () => {
      addRow(table, cell.parentElement.rowIndex, uuid);
      popup.remove();
    };

    const addColBtn = document.createElement("button");
    addColBtn.textContent = "Add Column";
    addColBtn.onclick = () => {
      addColumn(table, cell.cellIndex, uuid);
      popup.remove();
    };

    const delRowBtn = document.createElement("button");
    delRowBtn.textContent = "Delete Row";
    delRowBtn.onclick = () => {
      deleteRow(table, cell.parentElement.rowIndex);
      popup.remove();
    };

    const delColBtn = document.createElement("button");
    delColBtn.textContent = "Delete Column";
    delColBtn.onclick = () => {
      deleteColumn(table, cell.cellIndex);
      popup.remove();
    };

    const deleteTableBtn = document.createElement("button");
    deleteTableBtn.textContent = "Delete Table";
    deleteTableBtn.onclick = () => {
      table.parentElement.remove();
      popup.remove();
    };

    popup.appendChild(addRowBtn);
    popup.appendChild(addColBtn);
    popup.appendChild(delRowBtn);
    popup.appendChild(delColBtn);
    popup.appendChild(deleteTableBtn);

    document.body.appendChild(popup);

    document.addEventListener("click", () => popup.remove(), { once: true });
  };

  const addRow = (table, rowIndex, uuid) => {
    let row = table.insertRow(rowIndex + 1);
    row.id = `row-${uuid}-${table.rows.length - 1}`;

    for (let i = 0; i < table.rows[0].cells.length; i++) {
      let cell = row.insertCell(i);
      cell.contentEditable = "true";
      cell.innerHTML = "&nbsp;";
      cell.id = `cell-${uuid}-${table.rows.length - 1}-${i}`;
      cell.classList.add("resizable-cell");

      const kebabMenu = document.createElement("div");
      kebabMenu.innerHTML = "⋮";
      kebabMenu.classList.add("kebab-menu");
      kebabMenu.onclick = (event) => showPopup(event, cell, table, uuid);
      cell.appendChild(kebabMenu);

      const resizeHandle = document.createElement("div");
      resizeHandle.classList.add("resize-handle");
      resizeHandle.onmousedown = (e) => startResizing(e, cell);
      cell.appendChild(resizeHandle);
    }
  };

  const addColumn = (table, colIndex, uuid) => {
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      let cell = row.insertCell(colIndex + 1);
      cell.contentEditable = "true";
      cell.innerHTML = "&nbsp;";
      cell.id = `cell-${uuid}-${i}-${row.cells.length - 1}`;
      cell.classList.add("resizable-cell");

      const kebabMenu = document.createElement("div");
      kebabMenu.innerHTML = "⋮";
      kebabMenu.classList.add("kebab-menu");
      kebabMenu.onclick = (event) => showPopup(event, cell, table, uuid);
      cell.appendChild(kebabMenu);

      const resizeHandle = document.createElement("div");
      resizeHandle.classList.add("resize-handle");
      resizeHandle.onmousedown = (e) => startResizing(e, cell);
      cell.appendChild(resizeHandle);
    }
  };

  const deleteRow = (table, rowIndex) => {
    if (table.rows.length > 1) table.deleteRow(rowIndex);
  };

  const deleteColumn = (table, colIndex) => {
    for (let i = 0; i < table.rows.length; i++) {
      if (table.rows[i].cells.length > 1) table.rows[i].deleteCell(colIndex);
    }
  };

  const startResizing = (e, cell) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = cell.offsetWidth;

    document.onmousemove = (event) => {
      const newWidth = startWidth + (event.clientX - startX);

      // Ensure the width stays within limits
      if (newWidth >= 20) {
        cell.style.width = `${newWidth}px`;
      }
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  return (
    <button
      onClick={() => insertTable(uuidv4())}
      className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group border border-gray-100 hover:border-gray-200"
    >
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
        <FaTable size={20} className="bg-blue-600" />
      </div>
      <div className="text-center">
        <div className="font-semibold text-sm text-gray-800">Table</div>
        <div className="text-xs text-gray-500 mt-1">Insert Table</div>
      </div>
    </button>
  );
};

export default TableTool;
