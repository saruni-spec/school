import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Props interface for both components
interface FeedbackProps {
  input_message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * SuccessFeedback Component
 *
 * Displays a success message with an optional action button
 * Styled for an educational, school-friendly interface
 */
export const SuccessFeedback: React.FC<FeedbackProps> = ({
  input_message,
  action,
}) => {
  return (
    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 max-w-md mx-auto shadow-lg">
      <div className="flex flex-col items-center">
        <CheckCircle2
          className="text-emerald-600 mb-4"
          size={72}
          strokeWidth={1.5}
        />
        <h2 className="text-2xl font-bold text-emerald-800 mb-4 text-center">
          Great Job!
        </h2>
        <p className="text-emerald-700 mb-6 text-center text-base leading-relaxed">
          {input_message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg 
                       hover:bg-emerald-700 transition-colors 
                       font-semibold text-lg shadow-md 
                       focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * FailureFeedback Component
 *
 * Displays an error message with an optional action button
 * Styled for an educational, school-friendly interface
 */
export const FailureFeedback: React.FC<FeedbackProps> = ({
  input_message,
  action,
}) => {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 max-w-md mx-auto shadow-lg">
      <div className="flex flex-col items-center">
        <AlertCircle
          className="text-red-600 mb-4"
          size={72}
          strokeWidth={1.5}
        />
        <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">
          Oops! Something Went Wrong
        </h2>
        <p className="text-red-700 mb-6 text-center text-base leading-relaxed">
          {input_message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="w-full py-3 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors 
                       font-semibold text-lg shadow-md 
                       focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

// Example usage component to demonstrate
export const FeedbackExample: React.FC = () => {
  const handleSuccessAction = () => {
    // Example action - could be navigation, reset, etc.
    console.log("Success action performed");
  };

  const handleErrorAction = () => {
    // Example action - could be retry, go back, etc.
    console.log("Error action performed");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100">
      <div className="w-full md:w-1/2">
        <SuccessFeedback
          input_message="Your student registration was completed successfully! Welcome to our school community."
          action={{
            label: "View Student Portal",
            onClick: handleSuccessAction,
          }}
        />
      </div>
      <div className="w-full md:w-1/2">
        <FailureFeedback
          input_message="We couldn't complete your registration. Please check the information and try again or contact school administration."
          action={{
            label: "Try Again",
            onClick: handleErrorAction,
          }}
        />
      </div>
    </div>
  );
};
