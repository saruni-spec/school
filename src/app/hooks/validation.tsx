"use client";
import React, { useState, useCallback } from "react";

/**
 * A custom React hook for managing form input validation
 *
 * @param initialValue - The initial value of the input (defaults to an empty string)
 * @param validators - An array of validation functions that check the input value
 * @returns An object with validation-related state and methods
 */
export default function Validation(
  initialValue = "",
  validators: ((value: string) => string | null)[]
) {
  // State to store the current input value
  const [value, set_value] = useState(initialValue);

  // State to store any validation error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates the input value against all provided validator functions
   *
   * @param inputValue - The value to be validated
   * @returns Boolean indicating whether the input passes all validations
   */
  const validate = useCallback(
    (inputValue: string) => {
      // Iterate through all provided validator functions
      for (const validator of validators) {
        // Run each validator on the input value
        const validationError = validator(inputValue);

        // If any validator returns an error message, set the error and return false
        if (validationError) {
          setError(validationError);
          return false;
        }
      }

      // If all validators pass, clear any previous errors
      setError(null);
      return true;
    },
    [validators] // Memoize this function based on the validators array
  );

  /**
   * Event handler for input changes that updates the value and runs validation
   *
   * @param e - The change event from the input element
   */
  const handle_change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      // Extract the new value from the input event
      const newValue = e.target.value;

      // Update the stored value
      set_value(newValue);

      // Validate the new value
      validate(newValue);
    },
    [validate] // Memoize this function to prevent unnecessary re-renders
  );

  // Return an object with the current state and methods for validation
  return {
    value, // Current input value
    error, // Current error message (null if no error)
    handle_change, // Event handler for input changes
    validate, // Method to manually trigger validation
    set_value, // Method to manually set the input value
  };
}

// Validators
export const required = (value: string) =>
  value.trim() === "" ? "This field is required" : null;

// Utility to format enum keys into human-readable labels
// Conert an enum type key to a string
export const formatEnumLabel = (enumValue: string) =>
  enumValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Generate select options from an enum
export const getEnumSelectOptions = <T extends Record<string, string>>(
  enumType: T
) =>
  Object.values(enumType).map((value) => ({
    value,
    label: formatEnumLabel(value),
  }));
// Example validators
export const validateKey = (value: string) => {
  if (!value) return "Key is required";
  if (value.length < 2) return "Key must be at least 2 characters";
  return null;
};

export const validateValue = (value: string) => {
  if (!value) return "Value is required";
  if (value.length < 3) return "Value must be at least 3 characters";
  return null;
};
