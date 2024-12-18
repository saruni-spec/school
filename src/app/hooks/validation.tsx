"use client";
import React, { useState, useCallback } from "react";
import { input_field, record } from "../types/types";

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
): input_field {
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
    setError, // Method to manually set the error message
    handle_value_change, // Method to get the value from a source other than the input element
  };
}

/**
 * A custom React hook for managing validation of a list of objects
 *
 * @param initialValue - The initial array of objects (defaults to an empty array)
 * @param validators - An array of validation functions that check the entire list or individual objects
 * @returns An object with validation-related state and methods
 */
export function ListValidation<T>(
  initialValue: T[] = [],
  validators: {
    listValidator?: (list: T[]) => string | null;
    itemValidator?: (item: T) => string | null;
  }
) {
  // State to store the current list of objects
  const [list, setList] = useState<T[]>(initialValue);

  // State to store any validation error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates the entire list against provided validator functions
   *
   * @returns Boolean indicating whether the list passes all validations
   */
  const validate = useCallback(() => {
    // First, check list-level validator if provided
    if (validators.listValidator) {
      const listValidationError = validators.listValidator(list);
      if (listValidationError) {
        setError(listValidationError);
        return false;
      }
    }

    // Then, check each item if item validator is provided
    if (validators.itemValidator) {
      for (const item of list) {
        const itemValidationError = validators.itemValidator(item);
        if (itemValidationError) {
          setError(itemValidationError);
          return false;
        }
      }
    }

    // If all validations pass, clear any previous errors
    setError(null);
    return true;
  }, [list, validators]);

  /**
   * Adds a new item to the list and validates
   *
   * @param item - The item to add to the list
   * @returns Boolean indicating whether the addition passes validation
   */
  const addItem = useCallback(
    (item: T) => {
      const newList = [...list, item];
      setList(newList);
      return validate();
    },
    [list, validate]
  );

  /**
   * Removes an item from the list at the specified index and validates
   *
   * @param index - The index of the item to remove
   * @returns Boolean indicating whether the removal passes validation
   */
  const removeItem = useCallback(
    (index: number) => {
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
      return validate();
    },
    [list, validate]
  );

  /**
   * Updates an item in the list at the specified index and validates
   *
   * @param index - The index of the item to update
   * @param updatedItem - The new item to replace the existing one
   * @returns Boolean indicating whether the update passes validation
   */
  const updateItem = useCallback(
    (index: number, updatedItem: T) => {
      const newList = list.map((item, i) => (i === index ? updatedItem : item));
      setList(newList);
      return validate();
    },
    [list, validate]
  );

  /**
   * Replaces the entire list and validates
   *
   * @param newList - The new list to replace the existing one
   * @returns Boolean indicating whether the new list passes validation
   */
  const setListItems = useCallback(
    (newList: T[]) => {
      setList(newList);
      return validate();
    },
    [validate]
  );

  // Return an object with the current state and methods for list manipulation and validation
  return {
    list, // Current list of objects
    error, // Current error message (null if no error)
    validate, // Method to manually trigger validation
    addItem, // Method to add an item to the list
    removeItem, // Method to remove an item from the list
    updateItem, // Method to update an item in the list
    setList: setListItems, // Method to replace the entire list
    setError, // Method to manually set the error message
  };
}

/**
 * A custom React hook for managing validation of an object
 *
 * @param initialValue - The initial object (defaults to an empty object)
 * @param validators - An object containing validator functions for specific keys
 * @returns An object with validation-related state and methods
 */
export function ObjectValidation<T extends record>(
  initialValue: T = {} as T,
  validators: {
    [K in keyof T]?: (value: T[K]) => string | null;
  } = {}
) {
  // State to store the current object
  const [object, setObject] = useState<T>(initialValue);

  // State to store any validation error messages
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  /**
   * Validates the entire object against provided validator functions
   *
   * @returns Boolean indicating whether the object passes all validations
   */
  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    // Check each key with a validator
    (Object.keys(validators) as Array<keyof T>).forEach((key) => {
      const validator = validators[key];
      if (validator) {
        const validationError = validator(object[key]);
        if (validationError) {
          newErrors[key] = validationError;
        }
      }
    });

    // Update errors state
    setErrors(newErrors);

    // Return validation result
    return Object.keys(newErrors).length === 0;
  }, [object, validators]);

  /**
   * Updates a specific field in the object and validates
   *
   * @param key - The key of the field to update
   * @param value - The new value for the field
   * @returns Boolean indicating whether the update passes validation
   */
  const updateField = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      // Create a new object with the updated field
      const updatedObject = { ...object, [key]: value };

      // Update the object state
      setObject(updatedObject);

      // Validate the specific field if a validator exists
      const validator = validators[key];
      if (validator) {
        const validationError = validator(value);

        // Update errors state for this field
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: validationError || undefined,
        }));

        // Return whether this specific field is valid
        return !validationError;
      }

      return true;
    },
    [object, validators]
  );

  /**
   * Completely replaces the object and validates
   *
   * @param newObject - The new object to replace the existing one
   * @returns Boolean indicating whether the new object passes validation
   */
  const setObjectValue = useCallback(
    (newObject: T) => {
      // Update the entire object
      setObject(newObject);

      // Validate the entire new object
      return validate();
    },
    [validate]
  );

  /**
   * Resets the object to its initial value
   */
  const reset = useCallback(() => {
    setObject(initialValue);
    setErrors({});
  }, [initialValue]);

  // Return an object with the current state and methods for object manipulation and validation
  return {
    object, // Current object
    errors, // Current validation errors for each field
    validate, // Method to manually trigger validation
    updateField, // Method to update a specific field
    setObject: setObjectValue, // Method to replace the entire object
    setErrors, // Method to manually set the error messages
    reset, // Method to reset the object to initial value
  };
}

// Validators
export const required = (value: string | number) =>
  //
  //convert the value to a string if its a number
  value.toString().trim() === "" ? "This field is required" : null;

/**
 * Validates that a list is not empty
 *
 * @param list - The array to validate
 * @param options - Optional configuration for the validator
 * @returns Error message or null if valid
 */
export const requiredList = <T extends record>(
  list: T[],
  options?: {
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  }
) => {
  const {
    minLength = 1,
    maxLength = Infinity,
    errorMessage = "At least one item is required",
  } = options || {};

  if (!list || list.length < minLength) {
    return errorMessage;
  }

  if (list.length > maxLength) {
    return `Cannot exceed ${maxLength} items`;
  }

  return null;
};

/**
 * Validates that an object has required fields
 *
 * @param obj - The object to validate
 * @param requiredFields - Array of keys that must have non-empty values
 * @returns Error message or null if valid
 */
export const requiredObject = <T extends record>(
  obj: T,
  requiredFields: Array<keyof T>,
  options?: {
    errorMessage?: string;
  }
) => {
  const { errorMessage = "Some required fields are missing" } = options || {};

  // Check if obj is null or undefined
  if (!obj) {
    return errorMessage;
  }

  // Check each required field
  for (const field of requiredFields) {
    const value = obj[field];

    // Check if value is undefined, null, or empty string/whitespace
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return `${String(field)} is required`;
    }
  }

  return null;
};

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
export const validatePassword = (value: string | number) => {
  value = value.toString();
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
