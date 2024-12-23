import React from "react";

interface ExtendedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline-success"
    | "outline-danger";
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
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    "outline-success":
      "border-2 border-green-500 text-green-600 hover:bg-green-50",
    "outline-danger": "border-2 border-red-500 text-red-600 hover:bg-red-50",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type="button"
      className={`
        rounded-md
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500
        transition-colors
        duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
