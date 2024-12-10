import React from "react";
import { record } from "../types/types";

// Define the type for the details prop
interface DetailsDisplayProps {
  details: record;
  title?: string;
  className?: string;
  actionButton?: {
    label?: string;
    onClick?: () => Promise<void> | void;
    icon?: React.ElementType;
    variant?: "primary" | "secondary" | "danger";
  };
}

export const DetailsDisplay: React.FC<DetailsDisplayProps> = ({
  details,
  title = "Details",
  className = "",
  actionButton,
}) => {
  // Function to format key (convert snake_case to Title Case)
  const formatKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Determine button styles based on variant
  const getButtonStyles = (variant?: "primary" | "secondary" | "danger") => {
    switch (variant) {
      case "primary":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-800";
    }
  };

  return (
    <div className={`bg-white shadow-md rounded-lg p-6 relative ${className}`}>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${getButtonStyles(
              actionButton.variant
            )}`}
          >
            {actionButton.icon &&
              React.createElement(actionButton.icon, { className: "w-5 h-5" })}
            {actionButton.label || (actionButton.icon ? "" : "Action")}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(details).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
          >
            <span className="font-medium text-gray-700">{formatKey(key)}:</span>
            <span className="text-gray-900 font-semibold">
              {value !== null && value !== undefined ? String(value) : "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
