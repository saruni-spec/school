// Alert.tsx
import React from "react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning";
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "success",
  className = "",
}) => {
  const variantStyles = {
    success: "bg-green-50 border-green-500 text-green-700",
    error: "bg-red-50 border-red-500 text-red-700",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
  };

  return (
    <div
      className={`
        p-4
        border-l-4
        rounded-md
        ${variantStyles[variant]}
        ${className}
      `}
      role="alert"
    >
      {children}
    </div>
  );
};

// AlertDescription.tsx
interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = "",
}) => {
  return <p className={`text-sm ${className}`}>{children}</p>;
};
