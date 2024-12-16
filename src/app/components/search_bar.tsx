import React, { useState } from "react";
import { record } from "../types/types";

interface SearchableListProps {
  initialData: record[];
  id_field: string | number;
  onItemSelect?: (item: record) => void;
}

const SearchableList: React.FC<SearchableListProps> = ({
  initialData,
  id_field = "id",
  onItemSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<record>();
  const [data] = useState(initialData);

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    // Type guard: Ensure item.name is a string before using string methods
    if (typeof item.name === "string") {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false; // Exclude items where name is not a string
  });

  const handleItemSelect = (item: record) => {
    setSelectedItem(item);

    // Type guard: Ensure item.name is a string before assigning it to searchTerm
    if (typeof item.name === "string") {
      setSearchTerm(item.name); // Populate input with selected item name
    }

    // Call the parent's onItemSelect callback if provided
    if (onItemSelect) {
      onItemSelect(item);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedItem(undefined); // Clear selection when user starts typing again
  };

  return (
    <div className="max-w-md mx-auto p-1 relative">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      {searchTerm && !selectedItem && filteredData.length > 0 && (
        <div className="absolute z-10 w-full bg-white shadow rounded-lg mt-1">
          <ul className="max-h-60 overflow-y-auto">
            {filteredData.map((item) => (
              <li
                key={item[id_field] as string | number}
                onClick={() => handleItemSelect(item)}
                className="px-4 py-2 border-b last:border-b-0 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-black">
                    {item.name as string}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {item.category as string}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchTerm && filteredData.length === 0 && (
        <div className="text-center py-4 text-gray-500">No items found</div>
      )}
    </div>
  );
};

export default SearchableList;
