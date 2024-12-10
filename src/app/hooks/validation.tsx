"use client";
import React, { useState, useCallback } from "react";
import { record } from "../types/types";

/**
 * A custom React hook for managing form input validation
 *
 * @param initialValue - The initial value of the input (defaults to an empty string)
 * @param validators - An array of validation functions that check the input value
 * @returns An object with validation-related state and methods
 */
export default function Validation(
  initialValue = "",
  validators: ((value: string | number) => string | null)[]
) {
  // State to store the current input value
  const [value, set_value] = useState<string | number>(initialValue);

  // State to store any validation error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates the input value against all provided validator functions
   *
   * @param inputValue - The value to be validated
   * @returns Boolean indicating whether the input passes all validations
   */
  const validate = useCallback(
    (inputValue: string | number) => {
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

  //
  //handle change that is not from the input element
  const handle_value_change = useCallback(
    (newValue: string | number) => {
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
    setError, // Method to manually set the error message
    handle_value_change, // Method to get the value from a source other than the input element
  };
}

// Validators
export const required = (value: string | number) =>
  //
  //convert the value to a string if its a number
  value.toString().trim() === "" ? "This field is required" : null;

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

//validator for email
export const validateEmail = (value: string | number) => {
  //
  //if the value is a number convert it to a string
  value = typeof value === "number" ? value.toString() : value;
  //check if the email is valid
  if (!value) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
  return null;
};

//validator for password
export const validatePassword = (value: string) => {
  //check if the password is valid
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const ValidateMultipleOptions = <T extends record>({
  initialSelected = [],
  maxSelections,
  minSelections,
  onSelectionChange,
}: {
  initialSelected?: T[];
  maxSelections?: number;
  minSelections?: number;
  onSelectionChange?: (selected: T[]) => void;
}) => {
  // State to keep track of selected options
  const [selectedOptions, setSelectedOptions] = useState<T[]>(initialSelected);
  const [error, setError] = useState<string | null>(null);

  // Validation function
  const validate = useCallback(
    (selectedOptions: T[]) => {
      // Check if the number of selected options is within the allowed range
      if (maxSelections && selectedOptions.length > maxSelections) {
        setError(`You can only select ${maxSelections} options`);
        return false;
      }

      // Check if the number of selected options meets the minimum requirement
      if (minSelections && selectedOptions.length < minSelections) {
        setError(`You must select at least ${minSelections} options`);
        return false;
      }

      setError(null);
      return true;
    },
    [maxSelections, minSelections]
  );

  // Handler to toggle option selection
  const handleOptionToggle = useCallback(
    (option: T) => {
      setSelectedOptions((prevSelected) => {
        // Check if option is already selected
        const isAlreadySelected = prevSelected.some(
          (selected) => selected.id === option.id
        );

        let newSelection: T[];
        if (isAlreadySelected) {
          // Remove the option if already selected
          newSelection = prevSelected.filter(
            (selected) => selected.id !== option.id
          );
        } else {
          // Add the option if not at max selections
          if (maxSelections && prevSelected.length >= maxSelections) {
            return prevSelected; // Do nothing if at max selections
          }
          newSelection = [...prevSelected, option];
        }

        // Call onSelectionChange if provided
        if (onSelectionChange) {
          onSelectionChange(newSelection);
        }

        // Validate the new selection
        validate(selectedOptions);

        return newSelection;
      });
    },
    [maxSelections, onSelectionChange, validate, selectedOptions]
  );

  // Handler to remove a specific option
  const handleRemoveOption = useCallback(
    (optionToRemove: T) => {
      const newSelection = selectedOptions.filter(
        (option) => option.id !== optionToRemove.id
      );

      setSelectedOptions(newSelection);

      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }

      validate(selectedOptions);
    },
    [selectedOptions, onSelectionChange, validate]
  );

  return {
    value: selectedOptions,
    error,
    handleOptionToggle,
    handleRemoveOption,
    validate,
    setSelectedOptions,
  };
};
