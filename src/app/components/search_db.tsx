// Type-on-Search Component (Recommended)
// components/TypeOnSearchComponent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { record } from "../types/types";

interface TypeOnSearchProps {
  display_fields: string[]; // Fields to display in results
  onSelect?: (item: record) => void; // Optional callback when an item is selected
}

export const SearchDb: React.FC<TypeOnSearchProps> = ({
  display_fields,
  onSelect,
}) => {
  const [search_term, setSearchTerm] = useState("");
  const [results, setResults] = useState<record[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: search_term,
          display_fields,
        }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [search_term, display_fields]);

  // Debounce search to reduce unnecessary API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search_term.trim()) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search_term, performSearch]);

  const handleItemSelect = (item: record) => {
    if (onSelect) {
      onSelect(item);
    }
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={search_term}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Search by name`}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading && (
        <div className="absolute top-full left-0 w-full z-10 mt-1 p-2 bg-gray-100 rounded-md">
          Searching...
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {display_fields.map((field) => item[field]).join(" - ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
