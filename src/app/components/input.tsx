import React from "react";

//input component inteeface
//add a class to each input for additional styling
//add a name for the label of the input
//add an error message for the input
// Base interface for common props
interface BaseInputProps {
  label?: string;
  error?: string | null;
  type?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  isTextArea?: boolean;
  rows?: number;
}

// Interface for input element
interface InputElementProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isTextArea?: false;
}

// Interface for textarea element
interface TextAreaElementProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isTextArea: true;
}

// Combined type for all possible props
type InputProps = BaseInputProps & (InputElementProps | TextAreaElementProps);

export const MyInput: React.FC<InputProps> = ({
  type = "text",
  label,
  error,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  isTextArea = false,
  rows = 4,
  ...props
}) => {
  // Common styles for both input and textarea
  const commonStyles = `
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
  `;

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

      {isTextArea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={rows}
          className={`
            ${commonStyles}
            resize-none
          `}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          className={commonStyles}
        />
      )}

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
