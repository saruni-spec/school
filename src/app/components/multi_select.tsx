import React from "react";
import { record } from "../types/types";

// Selected item properties
interface SelectedItemProps {
  option: record; // Selected option
  onRemove: () => void; // when the remove button is clicked
}
// Selected item with a remove button
export const SelectedItem: React.FC<SelectedItemProps> = ({
  option,
  onRemove,
}) => (
  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
    {option.id}
    {onRemove && (
      <button
        onClick={onRemove}
        className="text-blue-500 hover:text-blue-700"
        aria-label="Remove subject"
      >
        ×
      </button>
    )}
  </span>
);
// Check box item properties
interface CheckBoxItemProps {
  option: record; // Option to display
  isSelected: boolean; // Whether the option is selected
  onToggle: (subject: record) => void; // When the option is toggled
  selectionLimit?: number | null; // Maximum number of selections
}

// Check box item with a subject name and description
export const CheckBoxItem: React.FC<CheckBoxItemProps> = ({
  option,
  isSelected,
  onToggle,
  selectionLimit = null,
}) => {
  const handleClick = () => {
    if (selectionLimit === null || !isSelected) {
      onToggle(option);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out 
        flex justify-between items-center
        ${
          isSelected
            ? "bg-blue-100 border-blue-300 border"
            : "bg-gray-100 hover:bg-gray-200"
        }
        ${
          selectionLimit !== null &&
          !isSelected &&
          "opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div>
        <span className="font-medium text-gray-800">{option.id}</span>
        <p className="text-xs text-gray-600">{option.description as string}</p>
      </div>
      <input
        title={option.id as string}
        type="checkbox"
        checked={isSelected}
        onChange={() => {}}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
    </div>
  );
};
// Multi-select properties
interface MultiSelectProps {
  label?: string; // Label for the multi-select
  options?: record[]; // Options to display
  maxSelections?: number; // Maximum number of selections
  onSelectionChange?: (subjects: record[] & { id: string | number }) => void; // When the selection changes
  selectedOptions: record[]; // Selected options
  handleRemoveOption: (subject: record) => void; // When an option is removed
  handleOptionToggle: (subject: record) => void; // When an option is toggled
}

// Multi-select component
export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options = [],
  maxSelections,
  handleRemoveOption,
  selectedOptions,
  handleOptionToggle,
}) => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {label} (Max {maxSelections})
      </h2>

      {selectedOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Selected Options:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <SelectedItem
                key={option.id}
                option={option}
                onRemove={() => handleRemoveOption(option)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <CheckBoxItem
            key={option.id}
            option={option}
            isSelected={selectedOptions.some((s) => s.id === option.id)}
            onToggle={handleOptionToggle}
            selectionLimit={maxSelections}
          />
        ))}
      </div>

      {selectedOptions.length === maxSelections && (
        <p className="text-sm text-yellow-700 mt-4">
          Maximum number of options selected
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
