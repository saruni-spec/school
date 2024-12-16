import React, { useState } from "react";

const BooleanInput = ({ label = "Toggle", onChange, initialValue = false }) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700" htmlFor="toggle">
        {label}
      </label>
      <button
        type="button"
        id="toggle"
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
          rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isChecked ? "bg-blue-600" : "bg-gray-200"}
        `}
        role="switch"
        aria-checked={isChecked}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 
            transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${isChecked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};

export default BooleanInput;
