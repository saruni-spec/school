import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
  id: number;
}

interface MultiInputProps {
  label?: string;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string | null;
  placeholder?: string;
  className?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  validators?: {
    key?: ((value: string) => string | null)[];
    value?: ((value: string) => string | null)[];
  };
}

export const MultiInput: React.FC<MultiInputProps> = ({
  label,
  value = {},
  onChange,
  error,
  placeholder = "Add key-value pairs",
  className = "",
  keyPlaceholder = "Key (e.g., email)",
  valuePlaceholder = "Value (e.g., contact@example.com)",
  validators = {},
}) => {
  // Use a unique identifier for each input to help with stable keys
  const [inputs, setInputs] = useState<KeyValuePair[]>(
    Object.entries(value).map(([key, value], index) => ({
      key,
      value,
      id: Date.now() + index,
    }))
  );

  const [inputErrors, setInputErrors] = useState<{
    [id: number]: { key?: string | null; value?: string | null };
  }>({});

  // Validate a specific input field
  const validateInput = useCallback(
    (value: string, validators?: ((value: string) => string | null)[]) => {
      if (!validators) return null;

      for (const validator of validators) {
        const validationError = validator(value);
        if (validationError) {
          return validationError;
        }
      }
      return null;
    },
    []
  );

  // Memoized validation and value extraction
  const processedData = useMemo(() => {
    const newValue: Record<string, string> = {};
    const newErrors: {
      [id: number]: { key?: string | null; value?: string | null };
    } = {};

    inputs.forEach((input) => {
      const trimmedKey = input.key.trim();
      const trimmedValue = input.value.trim();

      // Validate key
      const keyError = validateInput(trimmedKey, validators.key);
      // Validate value
      const valueError = validateInput(trimmedValue, validators.value);

      // Only add to newValue if both key and value are valid and non-empty
      if (!keyError && !valueError && trimmedKey && trimmedValue) {
        newValue[trimmedKey] = trimmedValue;
      }

      // Store any errors
      if (keyError || valueError) {
        newErrors[input.id] = {
          key: keyError,
          value: valueError,
        };
      }
    });

    return { newValue, newErrors };
  }, [inputs, validateInput, validators]);

  // Separate the onChange effect to prevent unnecessary re-renders
  useEffect(() => {
    // Only call onChange if the value has actually changed
    const stringifiedNewValue = JSON.stringify(processedData.newValue);
    const stringifiedPrevValue = JSON.stringify(value);

    if (stringifiedNewValue !== stringifiedPrevValue) {
      onChange(processedData.newValue);
    }

    setInputErrors(processedData.newErrors);
  }, [processedData, onChange, value]);

  const addInput = () => {
    setInputs((prev) => [
      ...prev,
      {
        key: "",
        value: "",
        id: Date.now(),
      },
    ]);
  };

  const updateInput = (
    id: number,
    field: "key" | "value",
    newValue: string
  ) => {
    setInputs((prev) =>
      prev.map((input) =>
        input.id === id ? { ...input, [field]: newValue } : input
      )
    );
  };

  const removeInput = (id: number) => {
    setInputs((prev) => prev.filter((input) => input.id !== id));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
      )}

      <div className="space-y-2">
        {inputs.map((input) => (
          <div key={input.id} className="space-y-1">
            <div className="flex space-x-2 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={keyPlaceholder}
                  value={input.key}
                  onChange={(e) => updateInput(input.id, "key", e.target.value)}
                  className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 ${
                    inputErrors[input.id]?.key
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {inputErrors[input.id]?.key && (
                  <span className="text-sm text-red-600">
                    {inputErrors[input.id].key}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={valuePlaceholder}
                  value={input.value}
                  onChange={(e) =>
                    updateInput(input.id, "value", e.target.value)
                  }
                  className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 ${
                    inputErrors[input.id]?.value
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {inputErrors[input.id]?.value && (
                  <span className="text-sm text-red-600">
                    {inputErrors[input.id].value}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeInput(input.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                title="Remove this entry"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addInput}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        <Plus size={16} className="mr-1" /> Add Entry
      </button>

      {error && <span className="text-sm text-red-600">{error}</span>}

      {inputs.length === 0 && (
        <p className="text-sm text-gray-500">{placeholder}</p>
      )}
    </div>
  );
};
