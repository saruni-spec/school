//
///componnt to allow to select one key value pair from an object
import React from "react";

// Interface for the SelectObject component props
interface SelectObjectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string; // Label for the select input
  containerClassName?: string; // Classname for the container div
  labelClassName?: string; // Classname for the label
  errorClassName?: string; // Classname for the error message
  error?: string | null; // Error message
  options: Record<string, string | number>; // Object of key-value pairs to be displayed in the select input
  placeholder?: string; // Placeholder text
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Changed onChange to explicitly handle string value
}

// The SelectObject component is a functional component that accepts the props mentioned above
export const SelectObject: React.FC<SelectObjectProps> = ({
  label,
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  className = "",
  options,
  error,
  placeholder,
  required,
  value,
  onChange,
  ...props
}) => {
  // Handler to convert native event to string value
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
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
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {Object.entries(options).map(([key, value]) => (
            <option key={key} value={value as string | number}>
              {key}
            </option>
          ))}
          {Object.keys(options).length === 0 && (
            <option disabled>No options available</option>
          )}
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
