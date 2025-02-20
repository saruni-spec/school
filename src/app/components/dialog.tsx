import React, { createContext, useContext, useCallback } from "react";

const DialogContext = createContext({
  open: false,
  onOpenChange: () => {},
});

export const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children, asChild }) => {
  const { onOpenChange } = useContext(DialogContext);

  const handleClick = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  return <button onClick={handleClick}>{children}</button>;
};

export const DialogContent = ({ children, className = "" }) => {
  const { open, onOpenChange } = useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange()}
      />

      {/* Dialog panel */}
      <div
        className={`
        relative z-50 
        w-full max-w-lg
        bg-white rounded-lg shadow-lg
        p-6
        mx-4
        transform transition-all
        ${className}
      `}
      >
        <div className="absolute right-4 top-4">
          <button
            onClick={() => onOpenChange()}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ className = "", ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
      {...props}
    />
  );
};

export const DialogTitle = ({ className = "", ...props }) => {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
};

export default Dialog;
