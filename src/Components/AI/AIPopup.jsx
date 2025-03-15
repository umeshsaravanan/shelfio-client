import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css"; // Required for LaTeX rendering
import "highlight.js/styles/github-dark.css"; // Code highlighting theme

import "./AI.css";

import { createPortal } from "react-dom";
import useAxios from "../../Hooks/useAxios";

const AIPopup = ({ selectedText, onClose }) => {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { axiosInstance } = useAxios();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/ask-ai", {
        prompt: inputText,
        text: selectedText,
      });

      setResponse(data.response);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleTextExpansion = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  const copyResponseToClipboard = () => {
    if (!response) return;

    // Create temporary element with HTML content
    const tempElement = document.createElement("div");
    tempElement.innerHTML = response.response || "";

    // Convert the markdown to HTML for clipboard
    const tempHtml = document.createElement("div");
    tempHtml.innerHTML = response.response || "";

    navigator.clipboard
      .writeText(tempElement.textContent)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Truncate selected text if it's too long
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength || isTextExpanded) return text;
    return text.substring(0, maxLength) + "...";
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      ></div>

      {/* Popup */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`fixed z-30 ${
          isFullScreen ? "inset-0" : "top-0 right-0 h-full"
        } flex items-center justify-end`}
      >
        <div
          className={`bg-white shadow-lg border-l border-t border-b border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
          ${
            isFullScreen
              ? "w-full h-full rounded-none animate-scale-in"
              : "w-96 h-5/6 rounded-l-lg animate-slide-left"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                {/* Background subtle glow */}
                <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.08)" />

                {/* Main brain outline */}
                <path
                  d="M12 21.5C12 21.5 19 17.5 19 12V6.5C17.5 5 14.5 4 12 4C9.5 4 6.5 5 5 6.5V12C5 17.5 12 21.5 12 21.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(255,255,255,0.1)"
                />

                {/* Neural network connections */}
                <path
                  d="M9 12C9 12 10 14 12 14C14 14 15 12 15 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M8 9C8 9 9.5 10 12 10C14.5 10 16 9 16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Neural nodes */}
                <circle cx="7.5" cy="9" r="1" fill="currentColor" />
                <circle cx="16.5" cy="9" r="1" fill="currentColor" />
                <circle cx="8.5" cy="12" r="1" fill="currentColor" />
                <circle cx="15.5" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="7" r="1" fill="currentColor" />
                <circle cx="12" cy="17" r="1" fill="currentColor" />

                {/* Pulse effect */}
                <circle cx="12" cy="10" r="1.5" fill="white">
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0.2"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Data flow lines */}
                <path
                  d="M12 7L12 17"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeDasharray="1 2"
                />

                <path
                  d="M7.5 9L16.5 9"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeDasharray="1 2"
                />

                <path
                  d="M8.5 12L15.5 12"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeDasharray="1 2"
                />
              </svg>
              Shelfbook AI
            </h2>
            <div className="flex items-center">
              <button
                onClick={toggleFullScreen}
                className="text-white hover:text-gray-200 transition-colors mr-3"
                title={isFullScreen ? "Exit full screen" : "Full screen"}
              >
                {isFullScreen ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9L4 4m0 0l5 0m-5 0v5m15-5l-5 5m5 0h-5m5-5v5M4 20l5-5m-5 5h5m-5-5v5m15-5l-5-5m5 0v5m0-5h-5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
                title="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Content Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {/* Selected Text Bubble with Truncation */}
            {selectedText && (
              <div className="mb-6">
                <div className="bg-blue-100 p-3 rounded-lg rounded-tl-none shadow-sm inline-block max-w-full">
                  <p className="text-sm text-gray-800">
                    {truncateText(selectedText)}
                  </p>
                  {selectedText.length > 150 && (
                    <button
                      onClick={toggleTextExpansion}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 transition-colors"
                    >
                      {isTextExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Selected text
                  </div>
                </div>
              </div>
            )}

            {/* AI Response Bubble with Copy Button */}
            {response && (
              <div className="markup-container relative p-3 rounded-lg rounded-tr-none shadow-sm inline-block max-w-full">
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={copyResponseToClipboard}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {isCopied ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5m10 0h2a2 2 0 012 2v10a2 2 0 01-2 2h-4m-6-6v3a2 2 0 002 2h2a2 2 0 002-2v-1"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="pr-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeHighlight]}
                  >
                    {response.response}
                  </ReactMarkdown>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  AI response for "{response.prompt}"
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Ask AI about the selected text..."
                  rows={1}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
                {/* <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {inputText.length > 0 && "Press Enter to send"}
                </div> */}
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg disabled:bg-blue-300 flex-shrink-0 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AIPopup;
