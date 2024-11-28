import React from "react";

// Enhanced Select Props
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  error?: string | null;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  className = "",
  options,
  error,
  placeholder,
  required,
  ...props
}) => {
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
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
