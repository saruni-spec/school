"use client";
import React, { useState, useEffect } from "react";

// Comprehensive Date Picker Props
interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  dateFormat?: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY";
}

// Utility function to format dates
const formatDate = (
  date: Date,
  format: DatePickerProps["dateFormat"] = "YYYY-MM-DD"
) => {
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
  dateString: string,
  format: DatePickerProps["dateFormat"] = "YYYY-MM-DD"
): Date | null => {
  if (!dateString) return null;

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
    return null;
  }
};

// Enhanced Date Picker Component
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  minDate,
  maxDate,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  dateFormat = "YYYY-MM-DD",
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    props.value ? parseDate(props.value as string, dateFormat) : undefined
  );

  // Effect to handle external value changes
  useEffect(() => {
    if (props.value) {
      const newDate = parseDate(props.value as string, dateFormat);
      setSelectedDate(newDate || undefined);
    }
  }, [props.value, dateFormat]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newDate = parseDate(inputValue, dateFormat);

    // Validate date against min and max constraints
    if (newDate) {
      if (minDate && newDate < minDate) {
        // If date is before min date, set to min date
        setSelectedDate(minDate);
        props.onChange?.({
          ...e,
          target: {
            ...e.target,
            value: formatDate(minDate, dateFormat),
          },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      if (maxDate && newDate > maxDate) {
        // If date is after max date, set to max date
        setSelectedDate(maxDate);
        props.onChange?.({
          ...e,
          target: {
            ...e.target,
            value: formatDate(maxDate, dateFormat),
          },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }
    }

    setSelectedDate(newDate || undefined);
  };

  // Generate min and max date attributes
  const minDateAttr = minDate ? formatDate(minDate, "YYYY-MM-DD") : undefined;
  const maxDateAttr = maxDate ? formatDate(maxDate, "YYYY-MM-DD") : undefined;

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
        min={minDateAttr}
        max={maxDateAttr}
        value={selectedDate ? formatDate(selectedDate, "YYYY-MM-DD") : ""}
        onChange={handleDateChange}
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

// Validation Hook for Date Picker
export const useDateValidation = (
  initialValue = "",
  options: {
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    customValidator?: (date: Date) => string | null;
  } = {}
) => {
  const [value, set_value] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = (inputValue: string) => {
    const date = parseDate(inputValue);

    // Required validation
    if (options.required && !date) {
      setError("Date is required");
      return false;
    }

    // If no date and not required, it's valid
    if (!date) return true;

    // Min date validation
    if (options.minDate && date < options.minDate) {
      setError(`Date must be on or after ${formatDate(options.minDate)}`);
      return false;
    }

    // Max date validation
    if (options.maxDate && date > options.maxDate) {
      setError(`Date must be on or before ${formatDate(options.maxDate)}`);
      return false;
    }

    // Custom validation
    if (options.customValidator) {
      const customError = options.customValidator(date);
      if (customError) {
        setError(customError);
        return false;
      }
    }

    // Clear any previous errors
    setError(null);
    return true;
  };

  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    set_value(newValue);
    validate(newValue);
  };

  return {
    value,
    error,
    handle_change,
    validate,
    set_value,
  };
};

// Example Usage Component
export const DatePickerExample: React.FC = () => {
  // Example with min and max dates
  const birthDateInput = useDateValidation("", {
    required: true,
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(), // Today's date
    customValidator: (date) => {
      // Optional additional custom validation
      const age = new Date().getFullYear() - date.getFullYear();
      return age < 18 ? "You must be at least 18 years old" : null;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (birthDateInput.validate(birthDateInput.value)) {
      console.log("Date is valid:", birthDateInput.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DatePicker
        label="Birth Date"
        value={birthDateInput.value}
        onChange={birthDateInput.handle_change}
        error={birthDateInput.error || ""}
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date()}
        required
      />
      <button
        type="submit"
        className="
          w-full 
          bg-blue-500 
          text-white 
          py-2 
          rounded-md 
          hover:bg-blue-600
        "
      >
        Submit
      </button>
    </form>
  );
};
