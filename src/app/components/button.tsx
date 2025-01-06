import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface ExtendedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "ghost"
    | "ghost-primary"
    | "ghost-success"
    | "ghost-danger"
    | "link"
    | "subtle"
    | "add"
    | "delete";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ExtendedButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variantStyles = {
    // Solid variants
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",

    // Outline variants
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    "outline-primary":
      "border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
    "outline-secondary":
      "border-2 border-gray-500 text-gray-600 hover:bg-gray-50",
    "outline-success":
      "border-2 border-green-500 text-green-600 hover:bg-green-50",
    "outline-danger": "border-2 border-red-500 text-red-600 hover:bg-red-50",

    // Ghost variants
    ghost: "text-gray-600 hover:bg-gray-100",
    "ghost-primary": "text-blue-600 hover:bg-blue-50",
    "ghost-success": "text-green-600 hover:bg-green-50",
    "ghost-danger": "text-red-600 hover:bg-red-50",

    // Special variants
    link: "text-blue-600 hover:text-blue-700 hover:underline p-0",
    subtle: "text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100",

    // Action variants (existing)
    add: "bg-green-500 text-white hover:bg-green-600 inline-flex items-center gap-2",
    delete:
      "bg-red-500 text-white hover:bg-red-600 inline-flex items-center gap-2",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const renderIcon = () => {
    if (variant === "add") return <Plus size={size === "sm" ? 16 : 20} />;
    if (variant === "delete") return <Trash2 size={size === "sm" ? 16 : 20} />;
    return null;
  };

  const baseStyles = variant.startsWith("link")
    ? ""
    : "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200";

  return (
    <button
      type="button"
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${!variant.startsWith("link") ? sizeStyles[size] : ""}
        ${className}
      `}
      {...props}
    >
      {renderIcon()}
      {children}
    </button>
  );
};
