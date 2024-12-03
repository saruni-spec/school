//component to render the progress indicator
export const RenderProgressIndicator = ({
  steps,
  currentStep,
  handleStepChange,
}: {
  steps: Array<Record<string, string | React.JSX.Element>>;
  currentStep: string;
  handleStepChange: (step: string) => void;
}) => {
  return (
    <div className="relative w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCurrentStep = currentStep === step.key;
          const isPastStep =
            steps.findIndex((s) => s.key === currentStep) > index;
          const isClickable = isPastStep || isCurrentStep;

          return (
            <div
              key={step.key as string}
              className={`
                  flex flex-col items-center relative
                  ${
                    isClickable
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-not-allowed"
                  }
                `}
              onClick={() =>
                isClickable ? handleStepChange(step.key as string) : null
              }
            >
              <div
                className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    font-bold transition-all duration-300
                    ${
                      isCurrentStep
                        ? "bg-blue-500 text-white scale-110"
                        : isPastStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }
                    ${isClickable ? "shadow-md" : ""}
                  `}
              >
                {index + 1}
              </div>
              <span
                className={`
                    text-xs mt-2 text-center 
                    ${
                      isCurrentStep
                        ? "font-bold text-blue-600"
                        : isPastStep
                        ? "text-green-600 font-semibold"
                        : "text-gray-500"
                    }
                  `}
              >
                {step.label}
              </span>
              {/* Connecting line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={`
                      absolute top-5 left-1/2 transform -translate-x-1/2 
                      h-0.5 w-full -z-10
                      ${isPastStep ? "bg-green-500" : "bg-gray-200"}
                    `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
