"use client";
import React, { useState, useCallback } from "react";
import {
  DateFormat,
  FieldConfig,
  FieldType,
  FieldValidation,
} from "../types/types";

/**
 * A unified validation hook that handles different types of form inputs
 *
 * @param config - Configuration object for the input field
 * @returns An object with validation-related state and methods
 */
export function useValidation(config: FieldConfig): FieldValidation {
  const {
    type,
    initialValue = type === FieldType.Date ? "" : "",
    required = false,
    validators = [],
    minDate,
    maxDate,
    date_format = "YYYY-MM-DD",
  } = config;

  // State management
  const [value, set_value] = useState<string | number>(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Validation logic
  const validate = useCallback(
    (inputValue: string) => {
      // Handle required validation
      if (
        required &&
        (inputValue === "" || inputValue === null || inputValue === undefined)
      ) {
        setError("This field is required");
        return false;
      }

      // Run custom validators
      for (const validator of validators) {
        const validationError = validator(inputValue);
        if (validationError) {
          setError(validationError);
          return false;
        }
      }

      // Additional type-specific validations
      if (type === FieldType.Date) {
        const date = date_format
          ? parseDate(inputValue, date_format as DateFormat)
          : parseDate(inputValue);

        // Required validation for dates
        if (required && !date) {
          setError("Date is required");
          return false;
        }

        // Min date validation
        if (minDate && date && date < minDate) {
          setError(`Date must be on or after ${formatDate(minDate)}`);
          return false;
        }

        // Max date validation
        if (maxDate && date && date > maxDate) {
          setError(`Date must be on or before ${formatDate(maxDate)}`);
          return false;
        }
      }

      // Clear any previous errors
      setError(null);
      return true;
    },
    [required, validators, type, minDate, maxDate, date_format]
  );

  // Change handler for input events
  const handle_change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const newValue = e.target.value;
      set_value(newValue);
      validate(newValue);
    },
    [validate]
  );

  // Change handler for programmatic value updates
  const handle_value_change = useCallback(
    (newValue: string) => {
      if (newValue === value) return;

      set_value(newValue);
      validate(newValue);
    },
    [validate, value]
  );

  // Return unified field validation object
  return {
    value,
    error,
    setError,
    validate,
    handle_change,
    handle_value_change,
    set_value,
    // Optional date-specific return
    ...(type === FieldType.Date
      ? {
          formatted_date: parseDate(value as string, date_format),
        }
      : {}),
  };
}

// Utility function to parse dates based on format
const parseDate = (
  dateString: string | Date,
  format: DateFormat = "YYYY-MM-DD"
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

const formatDate = (date: Date, format: DateFormat = "YYYY-MM-DD") => {
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
