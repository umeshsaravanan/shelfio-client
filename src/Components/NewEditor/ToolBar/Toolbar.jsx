import React, { useEffect, useState } from "react";
import katex from "katex";
import Prism from "prismjs";
import { v4 as uuidv4 } from "uuid";

import "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-matlab";

import TextFormat from "../Tools/TextFormat";
import Font from "../Tools/Font";
import Colors from "../Tools/Colors";
import Blocks from "../Tools/Blocks";

import MoreTools from "../Tools/MoreTools";
import AIAssistantButton from "../Tools/AiAssistant";
import { codeDetector } from "../Utils/CodeDetector";
import FileDownLoad from "../Tools/FileDownLoad";
import useAxios from "../../../Hooks/useAxios";
import { BASE_URL } from "../../../Config/Config";
import { useBookCtx } from "../../../Contexts/BookCtx";

const Toolbar = ({ editorRef }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textFormat, setTextFormat] = useState([]);

  const { axiosInstance } = useAxios();
  const { setShowOverlayLoading } = useBookCtx();

  const highlightColor = "ffff00";

  useEffect(() => {
    editorRef.current.focus();
    setupEventListeners();

    //eslint-disable-next-line
  }, []);

  const execCommand = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
  };

  const handleKeyDown = (event) => {
    if (event.key === " ") {
      // Detect space key
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;

      if (currentNode.nodeType === Node.TEXT_NODE) {
        const text = currentNode.textContent;
        const match = text.match(/^(\d+)\.$/); // Match "1.", "2." before space

        if (match) {
          event.preventDefault(); // Stop default space behavior
          const startNumber = parseInt(match[1], 10);

          // Remove the typed number + period
          currentNode.textContent = text.replace(/^(\d+)\.\s*/, "");

          // Insert ordered list
          insertAutoList("ordered", startNumber);
        }
      }
    }
  };

  const insertAutoList = (type, startNumber) => {
    document.execCommand("insertOrderedList", false, null);

    const list = document.querySelector("ol");
    if (list && startNumber) {
      list.start = startNumber;
    }
  };

  // Add event listeners for paste and keydown events
  const setupEventListeners = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.addEventListener("paste", handlePaste);
    editor.addEventListener("keydown", handleKeyDown);
  };

  // Handle paste event to detect and insert code blocks
  const handlePaste = async (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;

    // Check for images
    const files = Array.from(clipboardData.files);
    if (files.length > 0) {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length > 0) {
        const uuid = crypto.randomUUID(); // Generate a unique ID
        insertAttachment(imageFiles, uuid);
        return; // Stop further execution since we handled images
      }
    }

    // Handle text pasting
    const text = clipboardData.getData("text");
    if (isCode(text)) {
      insertCodeBlockWithLanguage(text);
    } else {
      document.execCommand("insertText", false, text);
    }
  };

  // Check if the text is code-like
  const isCode = (text) => {
    // Trim to avoid accidental whitespace-based detection
    const trimmedText = text.trim();

    // If it contains multiple lines and at least one line has `{}` or `;`, likely code
    const lines = trimmedText.split("\n");
    if (lines.length > 1 && lines.some((line) => /[{};]/.test(line))) {
      return true;
    }

    // If it starts with common programming keywords, more reliable
    const codePatterns = [
      /^\s*(function|class|def|import|export|var|let|const|public|private|return|if|else|try|catch|async|await)/,
      /^\s*<\/?[a-z][\s\S]*>/, // HTML/XML detection
    ];

    return codePatterns.some((pattern) => pattern.test(trimmedText));
  };

  // Insert code block with detected language
  const insertCodeBlockWithLanguage = (code) => {
    const language = codeDetector(code);
    insertCodeBlock(language, code);
  };

  const toggleBold = () => {
    execCommand("bold");
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    execCommand("italic");
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    execCommand("underline");
    setIsUnderline(!isUnderline);
  };

  const toggleHighlight = () => {
    if (isHighlighted) {
      execCommand("hiliteColor", "transparent");
    } else {
      execCommand("hiliteColor", highlightColor);
    }
    setIsHighlighted(!isHighlighted);
  };

  const changeFontSize = (size) => {
    document.execCommand("removeFormat"); // Remove existing font size formats

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement("span");
    span.style.fontSize = size;

    // Extract selected text and apply styling
    span.appendChild(range.extractContents());
    range.insertNode(span);

    // Move selection back inside the new span
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);

    setFontSize(size);
  };

  const changeFontFamily = (family) => {
    execCommand("fontName", family);
    setFontFamily(family);
  };

  const alignText = (alignment) => {
    execCommand("justify" + alignment);
  };

  const indentText = () => {
    execCommand("indent");
  };

  const formatText = (format) => {
    setTextFormat((prev) => {
      prev.filter((exitingFormat) => exitingFormat === format);
      prev.push(format);

      return prev;
    });

    execCommand(format);
  };

  const changeHeading = (heading) => {
    if (!heading || heading === "p") {
      document.execCommand("formatBlock", false, "<p>"); // Set normal text
    } else {
      document.execCommand("formatBlock", false, `<${heading}>`); // Apply heading
    }
  };

  const outdentText = () => {
    execCommand("outdent");
  };

  const insertList = (type) => {
    execCommand(
      "insert" + (type === "ordered" ? "OrderedList" : "UnorderedList")
    );
  };

  const insertCheckboxList = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const list = document.createElement("ul");
    list.classList.add("checkbox-list");

    const listItem = document.createElement("li");
    listItem.contentEditable = "true";
    listItem.classList.add("checkbox-item");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("data-checked", "false"); // Default unchecked
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "8px";
    checkbox.addEventListener("change", () => {
      checkbox.setAttribute("data-checked", checkbox.checked);
    });

    const textNode = document.createElement("span");
    textNode.contentEditable = "true";
    textNode.style.flex = "1";
    textNode.innerHTML = "&nbsp;";

    listItem.appendChild(checkbox);
    listItem.appendChild(textNode);
    list.appendChild(listItem);

    range.deleteContents();
    range.insertNode(list);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(textNode);
    newRange.collapse(false);
    selection.addRange(newRange);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (event) => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const currentNode =
        range.startContainer.nodeType === 3
          ? range.startContainer.parentNode
          : range.startContainer;
      const currentLi = currentNode.closest("li");
      const checkboxList = currentLi?.closest(".checkbox-list");

      if (
        event.key === "Enter" &&
        currentLi &&
        currentLi.classList.contains("checkbox-item")
      ) {
        const textNode = currentLi.querySelector("span");
        const textContent = textNode ? textNode.textContent.trim() : "";

        if (textContent === "") {
          // Remove empty checkbox item
          event.preventDefault();
          currentLi.remove();

          if (checkboxList) {
            const newSpan = document.createElement("span");
            newSpan.contentEditable = "true";
            newSpan.innerHTML = "&nbsp;";

            checkboxList.insertAdjacentElement("afterend", newSpan);

            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(newSpan);
            newRange.collapse(false);
            selection.addRange(newRange);
          }
        } else {
          // Create new checkbox item
          event.preventDefault();

          const newListItem = document.createElement("li");
          newListItem.contentEditable = "true";
          newListItem.classList.add("checkbox-item");

          const checkbox = document.createElement("input");
          checkbox.setAttribute("data-checked", "false");
          checkbox.type = "checkbox";
          checkbox.style.marginRight = "8px";
          checkbox.addEventListener("change", () => {
            checkbox.setAttribute("data-checked", checkbox.checked);
          });

          const newTextNode = document.createElement("span");
          newTextNode.contentEditable = "true";
          newTextNode.style.flex = "1";
          newTextNode.innerHTML = "&nbsp;";

          newListItem.appendChild(checkbox);
          newListItem.appendChild(newTextNode);

          currentLi.parentNode.insertBefore(newListItem, currentLi.nextSibling);

          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(newTextNode);
          newRange.collapse(false);
          selection.addRange(newRange);
        }
      }
    };

    editor.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.removeEventListener("keydown", handleKeyDown);
    };
    //eslint-disable-next-line
  }, []);

  const insertImage = () => {
    const url = prompt("Enter the image URL:", "");
    if (url) {
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "100%";
      execCommand("insertHTML", img.outerHTML);
    }
  };

  const insertCodeBlock = (language, codeText, uuid) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // Create main wrapper
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.marginBottom = "10px";
    wrapper.style.border = "1px solid #e0e0e0";
    wrapper.style.borderRadius = "6px";
    wrapper.style.overflow = "hidden";
    wrapper.setAttribute("contenteditable", "false"); // Prevent editing wrapper
    wrapper.id = `code-container-${uuid}`;

    // Create header for the code block
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.padding = "6px 10px";
    header.style.backgroundColor = "#f8f8f8";
    header.style.borderBottom = "1px solid #e0e0e0";

    // Create language selector
    const select = document.createElement("select");
    const languages = [
      "javascript",
      "python",
      "css",
      "html",
      "java",
      "c",
      "cpp",
    ];

    select.style.padding = "3px 6px";
    select.style.fontSize = "12px";
    select.style.borderRadius = "3px";
    select.style.border = "1px solid #ccc";
    select.style.cursor = "pointer";
    select.style.backgroundColor = "#fff";
    select.style.outline = "none";
    select.style.width = "auto";
    select.id = `code-select-${uuid}`;

    languages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang.toUpperCase();
      select.appendChild(option);
    });

    select.value = language;

    // Language label
    const langLabel = document.createElement("span");
    langLabel.textContent = "Language: ";
    langLabel.style.fontSize = "12px";
    langLabel.style.color = "#666";

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "×";
    removeBtn.title = "Remove code block";
    removeBtn.style.background = "none";
    removeBtn.style.border = "none";
    removeBtn.style.color = "#888";
    removeBtn.style.fontSize = "16px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.padding = "0px 4px";
    removeBtn.style.borderRadius = "3px";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.height = "20px";
    removeBtn.style.width = "20px";
    removeBtn.id = `code-remove-btn-${uuid}`;

    removeBtn.addEventListener("click", () => {
      wrapper.remove();
    });

    // Add label, selector, and remove button to header
    const headerLeft = document.createElement("div");
    headerLeft.style.display = "flex";
    headerLeft.style.alignItems = "center";
    headerLeft.style.gap = "6px";
    headerLeft.appendChild(langLabel);
    headerLeft.appendChild(select);

    header.appendChild(headerLeft);
    header.appendChild(removeBtn);

    // Code block container
    const pre = document.createElement("pre");
    pre.style.backgroundColor = "#f5f5f5";
    pre.style.padding = "10px";
    pre.style.margin = "0";
    pre.style.overflowX = "auto";
    pre.style.display = "block";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak = "break-word";

    const code = document.createElement("code");
    code.contentEditable = "true"; // Allow editing only inside code
    code.style.display = "block";
    code.style.outline = "none";
    code.style.border = "none";
    code.style.padding = "8px";
    code.style.width = "100%";
    code.style.whiteSpace = "pre-wrap";
    code.style.wordBreak = "break-word";
    code.style.minHeight = "60px"; // Minimum height for UX
    code.textContent = codeText; // Insert the pasted code inside the <code> element
    code.id = `code-block-${uuid}`;

    let currentLanguage = language;
    pre.className = `language-${currentLanguage}`;
    code.className = `language-${currentLanguage}`;

    pre.appendChild(code);

    // Handle language change
    select.addEventListener("change", (event) => {
      const newLang = event.target.value;
      pre.className = `language-${newLang}`;
      code.className = `language-${newLang}`;
      Prism.highlightElement(code);
    });

    // Prevent deleting the whole block when backspacing an empty code block
    code.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && code.textContent.trim() === "") {
        event.preventDefault(); // Stop backspace from deleting the block
      }
    });

    // Add header and code block to wrapper
    wrapper.appendChild(header);
    wrapper.appendChild(pre);

    range.deleteContents();
    range.insertNode(wrapper);

    Prism.highlightElement(code);

    // Insert a new paragraph after the code block for better UX
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    wrapper.insertAdjacentElement("afterend", p);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(code);
    newRange.collapse(false);
    selection.addRange(newRange);
  };

  const insertLink = (uuid) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString() || "Click here";

    // Create inline link editor
    const linkEditorContainer = document.createElement("div");
    linkEditorContainer.className = "inline-link-editor";
    linkEditorContainer.style.display = "flex";
    linkEditorContainer.style.flexDirection = "column";
    linkEditorContainer.style.gap = "8px";
    linkEditorContainer.style.padding = "10px";
    linkEditorContainer.style.margin = "5px 0";
    linkEditorContainer.style.backgroundColor = "#f5f7f9";
    linkEditorContainer.style.border = "1px solid #e1e4e8";
    linkEditorContainer.style.borderRadius = "4px";
    linkEditorContainer.id = `link-container-${uuid}`;

    // Text input
    const textInputContainer = document.createElement("div");
    textInputContainer.style.display = "flex";
    textInputContainer.style.alignItems = "center";

    const textLabel = document.createElement("label");
    textLabel.textContent = "Text:";
    textLabel.style.width = "50px";
    textLabel.style.fontSize = "14px";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = selectedText;
    textInput.style.flex = "1";
    textInput.style.padding = "6px";
    textInput.style.border = "1px solid #ddd";
    textInput.style.borderRadius = "3px";
    textInput.style.fontSize = "14px";
    textInput.id = `link-text-input-${uuid}`;

    textInputContainer.appendChild(textLabel);
    textInputContainer.appendChild(textInput);

    // URL input
    const urlInputContainer = document.createElement("div");
    urlInputContainer.style.display = "flex";
    urlInputContainer.style.alignItems = "center";

    const urlLabel = document.createElement("label");
    urlLabel.textContent = "URL:";
    urlLabel.style.width = "50px";
    urlLabel.style.fontSize = "14px";

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.value = "https://";
    urlInput.style.flex = "1";
    urlInput.style.padding = "6px";
    urlInput.style.border = "1px solid #ddd";
    urlInput.style.borderRadius = "3px";
    urlInput.style.fontSize = "14px";

    urlInput.id = `link-url-input-${uuid}`;

    urlInputContainer.appendChild(urlLabel);
    urlInputContainer.appendChild(urlInput);

    // Buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "flex-end";
    buttonsContainer.style.gap = "8px";
    buttonsContainer.style.marginTop = "4px";

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.backgroundColor = "#f1f2f4";
    cancelButton.style.border = "1px solid #ccc";
    cancelButton.style.borderRadius = "3px";
    cancelButton.style.padding = "5px 10px";
    cancelButton.style.fontSize = "14px";
    cancelButton.style.cursor = "pointer";
    cancelButton.id = `link-cancel-btn-${uuid}`;

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.backgroundColor = "#0066cc";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "3px";
    saveButton.style.padding = "5px 12px";
    saveButton.style.fontSize = "14px";
    saveButton.style.cursor = "pointer";
    saveButton.id = `link-save-btn-${uuid}`;

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(saveButton);

    // Add all elements to the container
    linkEditorContainer.appendChild(textInputContainer);
    linkEditorContainer.appendChild(urlInputContainer);
    linkEditorContainer.appendChild(buttonsContainer);

    // Insert the editor into the document
    range.deleteContents();
    range.insertNode(linkEditorContainer);

    // Focus the URL input and select all text
    urlInput.focus();
    urlInput.select();

    // Save link function
    function saveLink() {
      const linkText = textInput.value.trim() || "Link";
      const linkUrl = urlInput.value.trim();

      if (!linkUrl) {
        urlInput.focus();
        return;
      }

      // Create link element
      const anchor = document.createElement("a");
      anchor.href = linkUrl;
      anchor.textContent = linkText;
      anchor.target = "_blank";
      anchor.style.color = "#007bff";
      anchor.style.textDecoration = "underline";
      anchor.style.cursor = "pointer";
      anchor.id = `link-anchor-${uuid}`;
      anchor.style.pointerEvents = "auto"; // Ensure it's clickable

      // Replace editor with link
      linkEditorContainer.parentNode.replaceChild(anchor, linkEditorContainer);

      // Place cursor after the link
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStartAfter(anchor);
      newRange.collapse(true);
      selection.addRange(newRange);
    }

    // Cancel function
    function cancelLink() {
      // Create empty space where editor was
      const emptyNode = document.createTextNode("");
      linkEditorContainer.parentNode.replaceChild(
        emptyNode,
        linkEditorContainer
      );

      // Restore selection
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStartAfter(emptyNode);
      newRange.collapse(true);
      selection.addRange(newRange);
    }

    // Add event listeners
    saveButton.addEventListener("click", saveLink);
    cancelButton.addEventListener("click", cancelLink);

    // Handle enter key on inputs
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveLink();
      }
    });

    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveLink();
      }
    });
  };

  const insertDivider = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const hr = document.createElement("hr");
    hr.style.border = "none";
    hr.style.height = "1px";
    hr.style.backgroundColor = "#ccc";
    hr.style.margin = "10px 0";

    range.deleteContents();
    range.insertNode(hr);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(hr);
    selection.addRange(newRange);
  };

  const insertQuote = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const blockquote = document.createElement("blockquote");
    blockquote.contentEditable = "true";
    blockquote.style.borderLeft = "4px solid #007bff";
    blockquote.style.margin = "10px 0";
    blockquote.style.padding = "5px 10px";
    blockquote.style.color = "#555";
    blockquote.innerHTML = selection.toString() || "Enter quote here...";

    range.deleteContents();
    range.insertNode(blockquote);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(blockquote);
    newRange.collapse(false);
    selection.addRange(newRange);
  };

  const insertFormula = (uuid) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    // Create main wrapper
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.marginBottom = "10px";
    wrapper.style.border = "1px solid #e0e0e0";
    wrapper.style.borderRadius = "6px";
    wrapper.style.overflow = "hidden";
    wrapper.setAttribute("contenteditable", "false"); // Prevent editing wrapper
    wrapper.id = `container-${uuid}`;

    // Create header for the formula block
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.padding = "6px 10px";
    header.style.backgroundColor = "#f8f8f8";
    header.style.borderBottom = "1px solid #e0e0e0";

    // Formula label
    const formulaLabel = document.createElement("span");
    formulaLabel.textContent = "Formula";
    formulaLabel.style.fontSize = "12px";
    formulaLabel.style.color = "#666";

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "×";
    removeBtn.title = "Remove formula block";
    removeBtn.style.background = "none";
    removeBtn.style.border = "none";
    removeBtn.style.color = "#888";
    removeBtn.style.fontSize = "16px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.padding = "0px 4px";
    removeBtn.style.borderRadius = "3px";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.height = "20px";
    removeBtn.style.width = "20px";

    removeBtn.id = `remove-btn-${uuid}`;

    removeBtn.addEventListener("click", () => {
      wrapper.remove();
    });

    // Add label and remove button to header
    const headerLeft = document.createElement("div");
    headerLeft.style.display = "flex";
    headerLeft.style.alignItems = "center";
    headerLeft.style.gap = "6px";
    headerLeft.appendChild(formulaLabel);

    header.appendChild(headerLeft);
    header.appendChild(removeBtn);

    // Create content container
    const contentContainer = document.createElement("div");
    contentContainer.style.padding = "10px";

    // Create editor mode elements
    const editorMode = document.createElement("div");
    editorMode.id = `editor-mode-${uuid}`;

    const input = document.createElement("div");
    input.contentEditable = "true";
    input.style.fontFamily = "monospace";
    input.style.padding = "8px";
    input.style.border = "1px solid #ddd";
    input.style.borderRadius = "4px";
    input.style.width = "100%";
    input.style.minHeight = "60px"; // Minimum height for UX
    input.style.backgroundColor = "#f5f5f5";
    input.style.outline = "none";
    input.textContent = "a^2 + b^2"; // Default formula
    input.style.marginBottom = "10px";
    input.id = `input-${uuid}`;

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.backgroundColor = "#4CAF50";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.padding = "6px 12px";
    saveButton.style.borderRadius = "4px";
    saveButton.style.cursor = "pointer";
    saveButton.style.fontSize = "14px";

    saveButton.id = `save-btn-${uuid}`;

    editorMode.appendChild(input);
    editorMode.appendChild(saveButton);

    // Create display mode element
    const displayMode = document.createElement("div");
    displayMode.style.padding = "10px";
    displayMode.style.minHeight = "40px";
    displayMode.style.cursor = "pointer";

    // Create the rendered math element
    const renderedMath = document.createElement("div");
    renderedMath.className = "rendered-formula";
    renderedMath.style.display = "flex";
    renderedMath.style.justifyContent = "center";
    renderedMath.style.padding = "5px";
    displayMode.id = `display-mode-${uuid}`;

    displayMode.appendChild(renderedMath);

    // Add both modes to content container
    contentContainer.appendChild(editorMode);
    contentContainer.appendChild(displayMode);

    // Add header and content container to wrapper
    wrapper.appendChild(header);
    wrapper.appendChild(contentContainer);

    // Function to render the LaTeX formula
    const renderFormula = () => {
      try {
        // Clear previous content
        renderedMath.innerHTML = "";

        // Render the formula with KaTeX
        katex.render(input.textContent.trim(), renderedMath, {
          throwOnError: false,
          displayMode: true, // Ensure block-level rendering
        });

        // Ensure it takes up the full width (block-level)
        renderedMath.style.display = "block";
        renderedMath.style.width = "100%"; // Optional: makes it span the full container
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        renderedMath.textContent = `Error rendering formula: ${input.textContent}`;
      }
    };

    // Function to toggle between edit and display modes
    const toggleEditMode = (showEditor) => {
      if (showEditor) {
        editorMode.style.display = "block";
        displayMode.style.display = "none";
        input.focus();

        // Place cursor at end of input
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorMode.style.display = "none";
        displayMode.style.display = "block";
        renderFormula();
      }
    };

    // Handle clicking on the display to edit
    displayMode.addEventListener("click", () => {
      toggleEditMode(true);
    });

    // Handle save button click
    saveButton.addEventListener("click", () => {
      toggleEditMode(false);
    });

    // Prevent deleting the whole block when backspacing an empty input
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.textContent.trim() === "") {
        event.preventDefault(); // Stop backspace from deleting the block
      }

      // Prevent Enter from creating a new block
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        const br = document.createElement("br");
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.deleteContents();
        range.insertNode(br);

        // Move cursor after <br>
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Allow Ctrl+Enter or Shift+Enter for saving
      if (event.key === "Enter" && (event.ctrlKey || event.shiftKey)) {
        event.preventDefault();
        toggleEditMode(false); // Save and exit on Ctrl+Enter or Shift+Enter
      }
    });

    // Replace the selected content with the formula block
    range.deleteContents();
    range.insertNode(wrapper);

    // Insert a new paragraph after the formula block for better UX
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    wrapper.insertAdjacentElement("afterend", p);

    // Start in edit mode
    toggleEditMode(true);
  };

  const insertAttachment = async (files, uuid) => {
    if (!files || files.length === 0) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const attachmentContainer = document.createElement("div");
    Object.assign(attachmentContainer.style, {
      display: "flex",
      flexDirection: "column",
      margin: "10px 0",
      border: "1px solid #ddd",
      padding: "10px",
      borderRadius: "5px",
      background: "#f9f9f9",
      position: "relative",
      maxWidth: "100%",
      resize: "both",
      overflow: "auto",
    });
    attachmentContainer.id = `attach-container-${uuid}`;

    for (const file of files) {
      // Upload file to API
      const formData = new FormData();
      formData.append("file", file);

      let fileURL;
      let fileId;
      try {
        setShowOverlayLoading(true);
        const { data } = await axiosInstance.post(`file/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct format
          },
        });

        fileURL = `${BASE_URL}/file/${data.file_id}`;
        fileId = data.file_id;
      } catch (error) {
        console.error(
          "Error uploading file:",
          error.response?.data || error.message
        );
      } finally {
        setShowOverlayLoading(false);
      }

      const fileType = file.type.split("/")[0];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      let element;

      if (fileType === "image") {
        element = document.createElement("img");
        Object.assign(element, {
          src: fileURL,
          style:
            "max-width: 100%; height: auto; border-radius: 5px; margin-bottom: 10px;",
        });
      } else if (fileType === "video") {
        element = document.createElement("video");
        Object.assign(element, {
          src: fileURL,
          controls: true,
          style: "max-width: 100%; height: auto; margin-bottom: 10px;",
        });
      } else if (fileType === "audio") {
        element = document.createElement("audio");
        Object.assign(element, {
          src: fileURL,
          controls: true,
          style: "margin-bottom: 10px;",
        });
      } else {
        element = document.createElement("div");
        Object.assign(element.style, {
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
        });

        const link = document.createElement("a");
        Object.assign(link, {
          href: fileURL,
          target: "_blank",
          download: file.name,
          style:
            "color: #007bff; text-decoration: none; margin-left: 5px; cursor: pointer;",
        });

        if (["doc", "docx"].includes(fileExtension)) {
          link.innerHTML = `📄 Word Document: ${file.name}`;
        } else if (["xls", "xlsx"].includes(fileExtension)) {
          link.innerHTML = `📊 Excel Spreadsheet: ${file.name}`;
        } else {
          link.innerHTML = `📎 ${file.name}`;
        }

        element.appendChild(link);
      }

      element.id = `element-${uuid}-${fileId}`;

      // Remove Button
      const removeButton = document.createElement("button");
      removeButton.innerHTML = "×";
      removeButton.title = "Remove attachment";
      removeButton.id = `remove-btn-${uuid}`;
      Object.assign(removeButton.style, {
        position: "absolute",
        top: "5px",
        right: "5px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "2px 6px",
      });

      removeButton.onclick = removeButton.onclick = async () => {
        try {
          const response = await axiosInstance.delete(`file/delete/${fileId}`);
          if (response.status === 200) {
            attachmentContainer.remove();
          } else {
            console.error("Failed to delete file:", response);
          }
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      };

      attachmentContainer.appendChild(element);
      attachmentContainer.appendChild(removeButton);
    }

    // Insert into editor
    const emptyParagraph = document.createElement("p");
    emptyParagraph.innerHTML = "<br>";

    range.collapse(false);
    range.insertNode(emptyParagraph);
    range.insertNode(attachmentContainer);

    range.setStartAfter(emptyParagraph);
    range.setEndAfter(emptyParagraph);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="toolbar justify-between flex flex-wrap gap-2 p-2 bg-gray-50 rounded-t-lg border border-gray-200">
      <div className="flex gap-2">
        <AIAssistantButton />
        <Blocks
          insertList={insertList}
          insertCheckboxList={insertCheckboxList}
          editorRef={editorRef}
          insertImage={insertImage}
          insertCodeBlock={() => insertCodeBlock(undefined, "", uuidv4())}
          insertAttachment={(files) => insertAttachment(files, uuidv4())}
          insertLink={insertLink}
          insertDivider={insertDivider}
          insertQuote={insertQuote}
          insertFormula={() => insertFormula(uuidv4())}
        />

        <TextFormat
          isBold={isBold}
          toggleBold={toggleBold}
          isItalic={isItalic}
          toggleItalic={toggleItalic}
          isUnderline={isUnderline}
          toggleUnderline={toggleUnderline}
          isHighlighted={isHighlighted}
          toggleHighlight={toggleHighlight}
        />

        <Font
          fontFamily={fontFamily}
          changeFontFamily={changeFontFamily}
          fontSize={fontSize}
          changeFontSize={changeFontSize}
          changeHeading={changeHeading}
        />

        <Colors execCommand={execCommand} />

        <MoreTools
          alignText={alignText}
          indentText={indentText}
          outdentText={outdentText}
          formatText={formatText}
          activeFormats={textFormat}
        />
      </div>
      <FileDownLoad editorRef={editorRef} />
    </div>
  );
};

export default Toolbar;
