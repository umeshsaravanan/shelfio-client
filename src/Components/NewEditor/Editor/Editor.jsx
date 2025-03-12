import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import katex from "katex";
import useAxios from "../../../Hooks/useAxios";

const Editor = ({ editorRef, handleBlur, value = "" }) => {
  const [updateKey, setUpdateKey] = useState(0);
  const contentRef = useRef(value);
  const { axiosInstance } = useAxios();

  const forceUpdate = () => {
    setUpdateKey((prev) => prev + 1);
  };

  // Update the editor's content when the `value` prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      contentRef.current = value; // Update the ref to the latest value
      forceUpdate();
    }
  }, [value, editorRef]);

  useEffect(() => {
    editorRef.current.focus();
  }, [editorRef]);

  const deleteFile = async (fileId) => {
    try {
      await axiosInstance.delete(`file/delete/${fileId}`);
      console.log(`Deleted file: ${fileId}`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // Function to attach event listeners to remove buttons
    const attachRemoveListeners = () => {
      const attachments = editor.querySelectorAll("[id^='attach-container-']");

      attachments.forEach((attachmentContainer) => {
        const uuid = attachmentContainer.id.split("container-")[1];
        const removeButton = attachmentContainer.querySelector(
          `#remove-btn-${uuid}`
        );
        if (removeButton) {
          removeButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            attachmentContainer.remove();

            const fileElement = attachmentContainer.querySelector(
              `[id^='element-${uuid}-']`
            );

            if (!fileElement) return;

            // Extract fileId from element ID
            const fileId = fileElement.id.split(`element-${uuid}-`)[1];

            // Remove container immediately
            attachmentContainer.remove();

            // Call delete API in the background
            if (fileId) {
              deleteFile(fileId);
            }

            forceUpdate();
            handleBlur(); //it is not called because no focus on editor
          };
        }
      });
    };

    // Function to attach event listeners for resizing
    const attachResizeListeners = () => {
      const attachments = editor.querySelectorAll("[id^='container-']");
      attachments.forEach((attachmentContainer) => {
        const uuid = attachmentContainer.id.split("container-")[1];
        const resizer = attachmentContainer.querySelector(`#resizer-${uuid}`);
        if (resizer) {
          resizer.addEventListener("mousedown", (e) => {
            e.preventDefault();
            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
          });

          const resize = (e) => {
            attachmentContainer.style.width = `${
              e.clientX - attachmentContainer.getBoundingClientRect().left
            }px`;
            attachmentContainer.style.height = `${
              e.clientY - attachmentContainer.getBoundingClientRect().top
            }px`;
          };

          const stopResize = () => {
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
          };
        }
      });
    };

    // Function to attach event listeners for formula-related actions
    const attachFormulaListeners = () => {
      const formulas = editor.querySelectorAll("[id^='container-']");
      formulas.forEach((formulaContainer) => {
        const uuid = formulaContainer.id.split("container-")[1];

        const saveButton = formulaContainer.querySelector(`#save-btn-${uuid}`);
        const input = formulaContainer.querySelector(`#input-${uuid}`);
        const displayMode = formulaContainer.querySelector(
          `#display-mode-${uuid}`
        );
        const editorMode = formulaContainer.querySelector(
          `#editor-mode-${uuid}`
        );
        const renderedMath =
          formulaContainer.querySelector(".rendered-formula");

        if (!saveButton || !input || !displayMode || !renderedMath) return;

        const renderFormula = () => {
          try {
            renderedMath.innerHTML = "";
            katex.render(input.textContent.trim(), renderedMath, {
              throwOnError: false,
              displayMode: true,
            });
            renderedMath.style.display = "block";
            renderedMath.style.width = "100%";
          } catch (error) {
            console.error("KaTeX rendering error:", error);
            renderedMath.textContent = `Error rendering formula: ${input.textContent}`;
          }
        };

        const toggleEditMode = (showEditor) => {
          if (showEditor) {
            editorMode.style.display = "block";
            displayMode.style.display = "none";
            input.focus();
          } else {
            editorMode.style.display = "none";
            displayMode.style.display = "block";
            renderFormula();
          }
        };

        displayMode.addEventListener("click", () => {
          toggleEditMode(true);
        });

        saveButton.addEventListener("click", () => {
          toggleEditMode(false);
        });

        input.addEventListener("keydown", (event) => {
          if (event.key === "Backspace" && input.textContent.trim() === "") {
            event.preventDefault();
          }
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            const br = document.createElement("br");
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          if (event.key === "Enter" && (event.ctrlKey || event.shiftKey)) {
            event.preventDefault();
            toggleEditMode(false);
          }
        });
      });
    };

    const attachCodeBlockListeners = () => {
      const codeBlocks = editor.querySelectorAll("[id^='code-container-']");
      codeBlocks.forEach((wrapper) => {
        const uuid = wrapper.id.split("code-container-")[1];
        const removeBtn = wrapper.querySelector(`#code-remove-btn-${uuid}`);
        const select = wrapper.querySelector(`#code-select-${uuid}`);
        const code = wrapper.querySelector(`#code-block-${uuid}`);
        const pre = wrapper.querySelector("pre");

        if (removeBtn) {
          removeBtn.onclick = () => {
            wrapper.remove();
            forceUpdate();
            handleBlur(); //it is not called because no focus on editor
          };
        }

        if (select && code && pre) {
          select.addEventListener("change", (event) => {
            const newLang = event.target.value;
            pre.className = `language-${newLang}`;
            code.className = `language-${newLang}`;
            Prism.highlightElement(code);
          });
        }

        if (code) {
          code.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && code.textContent.trim() === "") {
              event.preventDefault(); // Stop backspace from deleting the block
            }
          });

          // Re-highlight code block
          Prism.highlightElement(code);
        }
      });
    };

    const attachLinkBlockListeners = () => {
      const linkBlocks = editor.querySelectorAll("[id^='link-container-']");
      linkBlocks.forEach((linkContainer) => {
        const uuid = linkContainer.id.split("link-container-")[1];
        const saveButton = linkContainer.querySelector(
          `#link-save-btn-${uuid}`
        );
        const cancelButton = linkContainer.querySelector(
          `#link-cancel-btn-${uuid}`
        );
        const textInput = linkContainer.querySelector(
          `#link-text-input-${uuid}`
        );
        const urlInput = linkContainer.querySelector(`#link-url-input-${uuid}`);

        if (saveButton && textInput && urlInput) {
          saveButton.replaceWith(saveButton.cloneNode(true));
          const newSaveButton = linkContainer.querySelector(
            `#link-save-btn-${uuid}`
          );

          newSaveButton.addEventListener("click", () => {
            const linkText = textInput.value.trim() || "Link";
            const linkUrl = urlInput.value.trim();
            if (!linkUrl) return;

            const anchor = document.createElement("a");
            anchor.href = linkUrl;
            anchor.textContent = linkText;
            anchor.target = "_blank";
            anchor.style.color = "#007bff";
            anchor.style.textDecoration = "underline";
            anchor.style.pointerEvents = "auto"; // Ensure it's clickable
            anchor.style.cursor = "pointer";
            linkContainer.replaceWith(anchor);
            forceUpdate();

            anchor.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent focus shift in contenteditable
              event.stopPropagation(); // Prevent interference from parent elements

              // Open link in a new tab
              window.open(anchor.href, "_blank");
            });
          });
        }

        if (cancelButton) {
          cancelButton.addEventListener("click", () => {
            const emptyNode = document.createTextNode("");
            linkContainer?.parentNode?.replaceChild(emptyNode, linkContainer);
            forceUpdate();
          });
        }
      });
    };

    const attachAnchorClickListeners = () => {
      const anchors = editor.querySelectorAll("a");

      anchors.forEach((anchor) => {
        anchor.style.pointerEvents = "auto"; // Ensure it's clickable
        anchor.style.cursor = "pointer";
        anchor.target = "_blank"; // Open in new tab

        anchor.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent focus shift in contenteditable
          event.stopPropagation(); // Prevent interference from parent elements

          // Open link in a new tab
          window.open(anchor.href, "_blank");
        });
      });
    };

    const attachTableListeners = () => {
      const tables = editor.querySelectorAll("table");

      tables.forEach((table) => {
        const uuid = table.id.split("table-")[1]; // Extract UUID from table ID

        table.querySelectorAll("td").forEach((cell) => {
          // Attach click listener for kebab menu
          const kebabMenu = cell.querySelector(".kebab-menu");
          if (kebabMenu) {
            kebabMenu.onclick = (event) => showPopup(event, cell, table, uuid);
          }

          // Attach resize handle listener
          const resizeHandle = cell.querySelector(".resize-handle");
          if (resizeHandle) {
            resizeHandle.onmousedown = (e) => startResizing(e, cell);
          }
        });
      });
    };

    // Function to show the kebab menu popup
    const showPopup = (event, cell, table, uuid) => {
      event.stopPropagation();

      // Remove existing popups
      document
        .querySelectorAll(".popup-menu")
        .forEach((popup) => popup.remove());

      // Create the popup menu
      const popup = document.createElement("div");
      popup.classList.add("popup-menu");
      popup.style.left = `${event.clientX}px`;
      popup.style.top = `${event.clientY}px`;

      // Add Row Button
      const addRowBtn = document.createElement("button");
      addRowBtn.textContent = "Add Row";
      addRowBtn.onclick = () => {
        addRow(table, cell.parentElement.rowIndex, uuid);
        popup.remove();
        forceUpdate();
      };

      // Add Column Button
      const addColBtn = document.createElement("button");
      addColBtn.textContent = "Add Column";
      addColBtn.onclick = () => {
        addColumn(table, cell.cellIndex, uuid);
        popup.remove();
        forceUpdate();
      };

      // Delete Row Button
      const delRowBtn = document.createElement("button");
      delRowBtn.textContent = "Delete Row";
      delRowBtn.onclick = () => {
        deleteRow(table, cell.parentElement.rowIndex);
        popup.remove();
        forceUpdate();
      };

      // Delete Column Button
      const delColBtn = document.createElement("button");
      delColBtn.textContent = "Delete Column";
      delColBtn.onclick = () => {
        deleteColumn(table, cell.cellIndex);
        popup.remove();
        forceUpdate();
      };

      // Delete Table Button
      const deleteTableBtn = document.createElement("button");
      deleteTableBtn.textContent = "Delete Table";
      deleteTableBtn.onclick = () => {
        table.parentElement.remove();
        popup.remove();
        forceUpdate();
      };

      // Append buttons to the popup
      popup.appendChild(addRowBtn);
      popup.appendChild(addColBtn);
      popup.appendChild(delRowBtn);
      popup.appendChild(delColBtn);
      popup.appendChild(deleteTableBtn);

      // Append popup to the document body
      document.body.appendChild(popup);

      // Remove popup on outside click
      document.addEventListener("click", () => popup.remove(), { once: true });
    };

    // Function to add a row
    const addRow = (table, rowIndex, uuid) => {
      const row = table.insertRow(rowIndex + 1);
      row.id = `row-${uuid}-${table.rows.length - 1}`; // Assign UUID-specific row ID

      for (let i = 0; i < table.rows[0].cells.length; i++) {
        const cell = row.insertCell(i);
        cell.contentEditable = "true";
        cell.innerHTML = "&nbsp;";
        cell.id = `cell-${uuid}-${table.rows.length - 1}-${i}`; // Assign UUID-specific cell ID

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
      }
    };

    // Function to add a column
    const addColumn = (table, colIndex, uuid) => {
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cell = row.insertCell(colIndex + 1);
        cell.contentEditable = "true";
        cell.innerHTML = "&nbsp;";
        cell.id = `cell-${uuid}-${i}-${row.cells.length - 1}`; // Assign UUID-specific cell ID

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
      }
    };

    // Function to delete a row
    const deleteRow = (table, rowIndex) => {
      if (table.rows.length > 1) table.deleteRow(rowIndex);
    };

    // Function to delete a column
    const deleteColumn = (table, colIndex) => {
      for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells.length > 1) table.rows[i].deleteCell(colIndex);
      }
    };

    // Function to handle cell resizing
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

    // Attach table listeners when the component mounts or updates
    attachTableListeners();

    attachRemoveListeners();
    attachResizeListeners();
    attachFormulaListeners();
    attachCodeBlockListeners();
    attachLinkBlockListeners();
    attachAnchorClickListeners();

    //eslint-disable-next-line
  }, [updateKey, editorRef, value]);

  return (
    <div
      ref={editorRef}
      contentEditable
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: contentRef.current }}
      className="editor p-4 overflow-y-auto overflow-x-hidden h-[calc(100%-112px)] rounded-b-lg outline-none"
    ></div>
  );
};

export default Editor;
