import React from "react";

//input component inteeface
//add a class to each input for additional styling
//add a name for the label of the input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  label?: string;
  error?: string | null;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

//
//add additonal properties as needed when creating an input element
export const Input: React.FC<InputProps> = ({
  type = "text",
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
        type={type}
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
