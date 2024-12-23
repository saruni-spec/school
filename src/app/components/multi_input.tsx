import React, { useMemo } from "react";
import { Trash2, Plus } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
  id: number;
}

interface MultiInputProps {
  label?: string;
  value: Record<string, string>;
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
  // Convert the value object to an array of KeyValuePair for rendering
  const inputs: KeyValuePair[] = useMemo(() => {
    const entries = Object.entries(value);
    // If there are no entries, provide an empty input
    if (entries.length === 0) {
      return [{ key: "", value: "", id: 0 }];
    }
    return entries.map(([key, val], index) => ({
      key,
      value: val,
      id: index,
    }));
  }, [value]);

  // Validate a single input
  const validateInput = (
    value: string,
    validators?: ((value: string) => string | null)[]
  ) => {
    if (!validators) return null;
    for (const validator of validators) {
      const validationError = validator(value);
      if (validationError) {
        return validationError;
      }
    }
    return null;
  };

  // Calculate errors for all inputs
  const inputErrors = useMemo(() => {
    const errors: {
      [id: number]: { key?: string | null; value?: string | null };
    } = {};

    inputs.forEach((input) => {
      if (!input.key && !input.value) return; // Skip validation for empty inputs
      const keyError = validateInput(input.key.trim(), validators.key);
      const valueError = validateInput(input.value.trim(), validators.value);

      if (keyError || valueError) {
        errors[input.id] = {
          key: keyError,
          value: valueError,
        };
      }
    });

    return errors;
  }, [inputs, validators]);

  const updateInput = (
    id: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newInputs = [...inputs];
    const inputIndex = newInputs.findIndex((input) => input.id === id);

    if (inputIndex === -1) return;

    newInputs[inputIndex] = {
      ...newInputs[inputIndex],
      [field]: newValue,
    };

    const newValueObj: Record<string, string> = {};
    newInputs.forEach((input) => {
      // Include empty values in the state
      newValueObj[input.key] = input.value;
    });

    // Filter out completely empty entries when updating parent
    const filteredValue: Record<string, string> = {};
    Object.entries(newValueObj).forEach(([k, v]) => {
      if (k.trim() || v.trim()) {
        filteredValue[k] = v;
      }
    });

    onChange(filteredValue);
  };

  const addInput = () => {
    const newId =
      inputs.length > 0 ? Math.max(...inputs.map((i) => i.id)) + 1 : 0;
    const newValue = { ...value, "": "" };
    onChange(newValue);
  };

  const removeInput = (id: number) => {
    const inputToRemove = inputs.find((input) => input.id === id);
    if (!inputToRemove) return;

    const newValue = { ...value };
    delete newValue[inputToRemove.key];

    // If removing the last input, add an empty one
    if (Object.keys(newValue).length === 0) {
      onChange({ "": "" });
    } else {
      onChange(newValue);
    }
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
