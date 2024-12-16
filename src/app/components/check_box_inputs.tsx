import React from "react";
import { record } from "../types/types";

interface CheckboxGroupProps {
  label?: string;
  options: record[];
  name: string;
  //id field
  id?: string | number;
  // the identifier is the key in the options object that will be used as the value of the checkbox
  identifier: string;
  // the title is the key in the options object that will be used as the label of the checkbox
  title?: string;
  value?: record[];
  // Modified to accept record[] instead of string[]
  onChange: (values: record[]) => void;
  error?: string | null;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  checkboxGroupClassName?: string;
  orientation?: "vertical" | "horizontal" | "grid";
  gridColumns?: number;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  name,
  value = [],
  onChange,
  error,
  id = "id",
  identifier,
  title = identifier,
  containerClassName,
  labelClassName,
  errorClassName,
  checkboxGroupClassName,
  orientation = "vertical",
  gridColumns = 3,
  ...props
}) => {
  const handleChange = (optionValue: string) => {
    // Create a set of current selected values using the specified identifier
    // This helps quickly check if an option is already selected
    const currentValues = new Set(
      value.map((item) => item[identifier] as string)
    );

    if (currentValues.has(optionValue)) {
      // If the option is already selected, remove it from the list
      // Filter out the item whose identifier matches the optionValue
      onChange(
        value.filter(
          // Use type assertion to tell TypeScript we're comparing strings
          (item) => (item[identifier] as string) !== optionValue
        )
      );
    } else {
      // If the option is not currently selected, add it
      // Find the full option object from the original options array
      const selectedOption = options.find(
        (option) => (option[identifier] as string) === optionValue
      );

      // Only add the option if it's found
      if (selectedOption) {
        // Spread the existing values and add the new selected option
        onChange([...value, selectedOption]);
      }
    }
  };

  const getLayoutClasses = () => {
    switch (orientation) {
      case "vertical":
        return "space-y-2";
      case "horizontal":
        return "flex space-x-4";
      case "grid":
        return `grid grid-cols-${gridColumns} gap-2`;
      default:
        return "space-y-2";
    }
  };

  return (
    <div className={`flex flex-col space-y-1 ${containerClassName}`}>
      {label && (
        <label
          className={`
            block
            text-sm
            font-medium
            text-gray-700
            ${labelClassName}
          `}
        >
          {label}
        </label>
      )}
      <div
        {...props}
        className={`
          ${getLayoutClasses()}
          ${checkboxGroupClassName || ""}
        `}
        role="group"
      >
        {options.map((option) => (
          <div
            key={option[id] as string | number}
            className="flex items-center"
          >
            <input
              type="checkbox"
              id={`${name}-${option[identifier] as string}`}
              name={name}
              value={option[identifier] as string}
              checked={value.some(
                (v) =>
                  (v[identifier] as string) === (option[identifier] as string)
              )}
              onChange={() => handleChange(option[identifier] as string)}
              className={`
                h-4
                w-4
                border
                text-gray-900
                focus:outline-none
                focus:ring-2
                rounded
                ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }
                disabled:opacity-50
                disabled:cursor-not-allowed
              `}
            />
            <label
              htmlFor={`${name}-${option[identifier] as string}`}
              className={`
                ml-2
                text-sm
                ${option.disabled ? "text-gray-400" : "text-gray-700"}
                ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {title
                ? (option[title] as string)
                : (option[identifier] as string)}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <span
          className={`
            text-sm
            text-red-600
            ${errorClassName}
          `}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default CheckboxGroup;
