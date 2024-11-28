import React from "react";

// Custom Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  button_name?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  button_name: children,
  className,
  ...props
}) => {
  return (
    <label
      className={`
        block 
        text-sm 
        font-medium 
        text-gray-700 
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
};
