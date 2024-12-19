// components/TypeOnSearchComponent.tsx
import React, { useState } from "react";
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

  const performSearch = async () => {
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
  };

  const handleItemSelect = (item: record) => {
    if (onSelect) {
      onSelect(item);
    }
    setSearchTerm(item.name as string);
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex">
        <input
          type="text"
          value={search_term}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name"
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={performSearch}
          disabled={!search_term.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </div>

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
              {item.student.student_code || "no class"} -{" "}
              {item.student.student_class?.class_progression.name || "no class"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
