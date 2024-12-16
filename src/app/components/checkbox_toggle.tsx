import React from "react";

interface BooleanInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const CheckBoxToggle: React.FC<BooleanInputProps> = ({
  label,
  error,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={props.id}
          className={`
            block
            text-sm
            font-medium
            text-gray-700
            ${labelClassName}
          `}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="checkbox"
        className={`
          h-4 w-4
          border
          rounded-md
          text-gray-900
          focus:outline-none
          focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }
          ${className}
        `}
        {...props}
      />
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

export default CheckBoxToggle;
