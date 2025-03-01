import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const currentQuery = new URLSearchParams(window.location.search).get("query");

  // Create a ref for the input element
  const inputRef = useRef(null);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      // Remove focus from the input field
      inputRef.current.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    navigate("/");
  };

  console.log({ currentQuery, query });

  useEffect(() => {
    setQuery(currentQuery || "");
  }, [currentQuery]);

  return (
    <div className="relative mb-6">
      <FaSearch className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Search books and pages..."
        className="w-full pl-10 placeholder:text-sm pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        ref={inputRef} // Attach the ref to the input element
      />
      {query && (
        <FaTimes
          className="absolute right-3 top-4 h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={handleClear}
        />
      )}
    </div>
  );
};

export default SearchBar;
