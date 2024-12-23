import React from "react";
import { generic_record } from "../types/types";



interface RadioGroupProps {
  label?: string;
  id_field?: string;
  value_field?: string;
  show_field?: string;
  options: generic_record[];
  name: string;
  value?: string;
  onChange: (record: generic_record) => void;
  error?: string | null;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  radioGroupClassName?: string;
  orientation?: "vertical" | "horizontal" | "grid";
  gridColumns?: number;
}

const RadioInputs: React.FC<RadioGroupProps> = ({
  label,
  id_field = "id",
  value_field = "id",
  show_field = "name",
  options,
  name,
  value,
  onChange,
  error,
  containerClassName,
  labelClassName,
  errorClassName,
  radioGroupClassName,
  orientation = "vertical",
  gridColumns = 3,
  ...props
}) => {
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

  //
  //
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //
    //get the option that was selected
    const selectedOption = options.find(
      (option) => option[value_field] === e.target.value
    );
    //
    onChange(
      selectedOption as generic_record
    );
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
          ${radioGroupClassName || ""}
        `}
        role="radiogroup"
      >
        {options.map((option) => (
          <div key={option[id_field] as string} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option[id_field]}`}
              name={name}
              value={option[value_field] as string | number}
              checked={value === option[value_field]}
              onChange={handleChange}
              className={`
                h-4
                w-4
                border
                text-gray-900
                focus:outline-none
                focus:ring-2
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
              htmlFor={`${name}-${option[value_field]}`}
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

export default RadioInputs;
