"use client";
import React, { useState, useCallback } from "react";

// Advanced input with validation hook
export const Validation = (
  initialValue = "",
  validators: ((value: string) => string | null)[]
) => {
  const [value, set_value] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (inputValue: string) => {
      for (const validator of validators) {
        const validationError = validator(inputValue);
        if (validationError) {
          setError(validationError);
          return false;
        }
      }
      setError(null);
      return true;
    },
    [validators]
  );

  const handle_change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      set_value(newValue);
      validate(newValue);
    },
    [validate]
  );

  return {
    value,
    error,
    handle_change,
    validate,
    set_value,
  };
};
