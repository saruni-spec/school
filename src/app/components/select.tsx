import React from "react";
import { record } from "../types/types";

// Select component
// This component is a select input field that can be used in forms
// it accepts the following props:
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; // Label for the select input
  id_field?: string | number; // Field to use as the id for the options
  show_field?: string | number; // Field to use as the display value for the options
  containerClassName?: string; // Classname for the container div
  labelClassName?: string; // Classname for the label
  errorClassName?: string; // Classname for the error message
  error?: string | null; // Error message
  options: record[]; // Array of options to be displayed in the select input
  placeholder?: string; // Placeholder text
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Function to run when the value of the select input changes
}
// The Select component is a functional component that accepts the props mentioned above
export const Select: React.FC<SelectProps> = ({
  label,
  id_field = "id",
  show_field = "name",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  className = "",
  options,
  error,
  placeholder = "Select an option",
  required,
  value, // value of the select input
  onChange, // what to do when the value changes
  ...props
}) => {
  return (
    // The select input field
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={props.id}
          className={`
            block
            text-sm
            font-medium
            text-gray-700
            mb-1
            ${labelClassName}
            ${
              required
                ? 'after:content-["*"] after:text-red-500 after:ml-1'
                : ""
            }
          `}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full
            px-3
            py-2
            border
            text-gray-900
            rounded-md
            focus:outline-none
            focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }
            ${className}
          `}
          value={value}
          onChange={onChange}
          {...props}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>

          {options &&
            options.map((option) => (
              <option
                key={option[id_field] as string | number}
                value={option[id_field] as string | number}
              >
                {option[show_field] as string}
              </option>
            ))}
          {!options && <>No options available</>}
        </select>
        {/* Dropdown icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <p
          id={`${props.id}-error`}
          className={`
            text-xs
            text-red-600
            mt-1
            ${errorClassName}
          `}
        >
          {error}
        </p>
      )}
    </div>
  );
};
