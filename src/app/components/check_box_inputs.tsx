import React from "react";
import { MyRecord } from "../types/types";

interface CheckboxGroupProps {
  label?: string;
  options: MyRecord[];
  //id field
  id?: string | number;
  // Will be used as the value of the checkbox
  value_field: string;
  // the show fild isthe fild that will be displayed
  show_field?: string;
  value?: MyRecord[];
  // Modified to accept record[] instead of string[]
  onChange: (values: MyRecord[]) => void;
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
  value = [],
  onChange,
  error,
  id = "id",
  value_field,
  show_field = value_field,
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
      value.map((item) => item[value_field] as string)
    );

    if (currentValues.has(optionValue)) {
      // If the option is already selected, remove it from the list
      // Filter out the item whose identifier matches the optionValue
      onChange(
        value.filter(
          // Use type assertion to tell TypeScript we're comparing strings
          (item) => (item[value_field] as string) !== optionValue
        )
      );
    } else {
      // If the option is not currently selected, add it
      // Find the full option object from the original options array
      const selectedOption = options.find(
        (option) => (option[value_field] as string) === optionValue
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
              id={`${option[value_field] as string}`}
              value={option[value_field] as string}
              checked={value.some(
                (v) =>
                  (v[value_field] as string) === (option[value_field] as string)
              )}
              onChange={() => handleChange(option[value_field] as string)}
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
              htmlFor={`${option[value_field] as string}`}
              className={`
                ml-2
                text-sm
                ${option.disabled ? "text-gray-400" : "text-gray-700"}
                ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {show_field
                ? (option[show_field] as string)
                : (option[value_field] as string)}
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
