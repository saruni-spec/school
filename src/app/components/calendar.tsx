"use client";
import React, { useCallback, useState } from "react";
import { DateField } from "../types/types";

type dateFormat = "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY";

// Comprehensive Date Picker Props
interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

// Enhanced Date Picker Component
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
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
        type="date"
        {...props}
        className={`
          w-full
          px-3
          py-2
          border
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

// Utility function to format dates
const formatDate = (date: Date, format: dateFormat = "YYYY-MM-DD") => {
  const pad = (num: number) => num.toString().padStart(2, "0");

  switch (format) {
    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    case "MM/DD/YYYY":
      return `${pad(date.getMonth() + 1)}/${pad(
        date.getDate()
      )}/${date.getFullYear()}`;
    case "DD/MM/YYYY":
      return `${pad(date.getDate())}/${pad(
        date.getMonth() + 1
      )}/${date.getFullYear()}`;
  }
};

// Utility function to parse dates based on format
const parseDate = (
  dateString: string | Date,
  format: dateFormat = "YYYY-MM-DD"
): Date | null => {
  if (!dateString) return null;
  //
  //check if the date string is already a date object
  if (dateString instanceof Date) return dateString;

  try {
    switch (format) {
      case "YYYY-MM-DD": {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      case "MM/DD/YYYY": {
        const [month, day, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
      }
      case "DD/MM/YYYY": {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
      }
    }
  } catch (error) {
    throw new Error(error as string);
  }
};
export const useDateValidation = (
  initialValue = "",
  required?: boolean,
  minDate?: Date,
  maxDate?: Date,
  dateFormat: dateFormat = "YYYY-MM-DD",
  customValidator?: (date: Date) => string | null
): DateField => {
  const [value, set_value] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (inputValue: string) => {
      const date = parseDate(inputValue);

      // Required validation
      if (required && !date) {
        setError("Date is required");
        return false;
      }

      // If no date and not required, it's valid
      if (!date) return true;

      // Min date validation
      if (minDate && date < minDate) {
        setError(`Date must be on or after ${formatDate(minDate)}`);
        return false;
      }

      // Max date validation
      if (maxDate && date > maxDate) {
        setError(`Date must be on or before ${formatDate(maxDate)}`);
        return false;
      }

      // Custom validation
      if (customValidator) {
        const customError = customValidator(date);
        if (customError) {
          setError(customError);
          return false;
        }
      }

      // Clear any previous errors
      setError(null);
      return true;
    },
    [required, minDate, maxDate, customValidator]
  );

  const handle_change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const newDate = parseDate(inputValue, "YYYY-MM-DD");

      validate(inputValue);
      if (newDate) {
        // Use formatDate to ensure the correct format for the input
        set_value(formatDate(newDate, "YYYY-MM-DD"));
      }
    },
    [validate]
  );

  //
  //handle change that is not from the input element
  const handle_value_change = useCallback(
    (newValue: string) => {
      // Update the stored value
      set_value(newValue);

      // Validate the new value
      validate(newValue);
    },
    [validate] // Memoize this function to prevent unnecessary re-renders
  );

  const formatted_date = parseDate(value, dateFormat);

  return {
    value,
    formatted_date,
    setError,
    error,
    handle_change,
    handle_value_change,
    validate,
    set_value,
  };
};
